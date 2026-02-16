/**
 * EFFETTI CHIMICI VISUALI - CHEMISTRY VISUAL EFFECTS
 * Un file dedicato agli effetti straordinari per la pagina di chimica
 * Creative chemistry animations and interactive effects
 */

// ==================== PARTICELLE CHIMICHE ====================

class ChemicalParticle {
    constructor(x, y, color, size = 3) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4 - 2;
        this.life = 1;
        this.decay = Math.random() * 0.01 + 0.005;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // Gravità
        this.life -= this.decay;
        this.rotation += this.rotationSpeed;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }

    isAlive() {
        return this.life > 0;
    }
}

// ==================== EFFETTO REAZIONE ESPLOSIVA ====================

class ExplosionEffect {
    constructor(x, y, color, intensity = 20) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.particles = [];
        this.intensity = intensity;
        this.createExplosion();
    }

    createExplosion() {
        for (let i = 0; i < this.intensity; i++) {
            const angle = (i / this.intensity) * Math.PI * 2;
            const speed = 2 + Math.random() * 3;
            const particle = new ChemicalParticle(this.x, this.y, this.color);
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed;
            particle.size = Math.random() * 6 + 2;
            this.particles.push(particle);
        }
    }

    update() {
        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => p.isAlive());
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }

    isFinished() {
        return this.particles.length === 0;
    }
}

// ==================== EFFETTO MOLECOLA FLUTTUANTE ====================

class FloatingMolecule {
    constructor(x, y, symbol, color) {
        this.x = x;
        this.y = y;
        this.startY = y;
        this.symbol = symbol;
        this.color = color;
        this.time = Math.random() * Math.PI * 2;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.scale = 1;
        this.rotation = 0;
    }

    update() {
        this.time += 0.02;
        this.y = this.startY + Math.sin(this.time) * 20;
        this.x += this.vx;
        this.rotation += 1;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.scale(this.scale, this.scale);
        
        // Disegna cerchio
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();

        // Disegna bordo
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 1;
        ctx.stroke();

        // Disegna testo
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = 1;
        ctx.fillText(this.symbol, 0, 0);

        ctx.restore();
    }
}

// ==================== EFFETTO REAZIONE A CATENA ====================

class ChainReaction {
    constructor(startX, startY, color1, color2) {
        this.x = startX;
        this.y = startY;
        this.color1 = color1;
        this.color2 = color2;
        this.particles = [];
        this.waves = [];
        this.time = 0;
        this.createChain();
    }

    createChain() {
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const angle = Math.random() * Math.PI * 2;
                const distance = 30 + i * 10;
                const x = this.x + Math.cos(angle) * distance;
                const y = this.y + Math.sin(angle) * distance;
                
                const explosion = new ExplosionEffect(x, y, this.color1, 10);
                this.particles.push(...explosion.particles);
            }, i * 100);
        }
    }

    update() {
        this.time++;
        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => p.isAlive());
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }

    isFinished() {
        return this.particles.length === 0 && this.time > 1500;
    }
}

// ==================== EFFETTO FUSIONE CHIMICA ====================

class ChemicalMerge {
    constructor(x1, y1, x2, y2, color1, color2, resultColor) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.color1 = color1;
        this.color2 = color2;
        this.resultColor = resultColor;
        this.particles = [];
        this.progress = 0;
        this.duration = 60;
    }

    update() {
        this.progress++;
        
        if (this.progress < this.duration) {
            // Particelle dalla prima molecola
            if (this.progress % 3 === 0) {
                const t = this.progress / this.duration;
                const particle = new ChemicalParticle(
                    this.x1 + (this.x2 - this.x1) * t,
                    this.y1 + (this.y2 - this.y1) * t,
                    this.color1,
                    3
                );
                this.particles.push(particle);
            }

            // Particelle dalla seconda molecola
            if (this.progress % 3 === 1) {
                const t = this.progress / this.duration;
                const particle = new ChemicalParticle(
                    this.x2 - (this.x2 - this.x1) * t,
                    this.y2 - (this.y2 - this.y1) * t,
                    this.color2,
                    3
                );
                this.particles.push(particle);
            }
        } else {
            // Esplosione finale
            if (this.progress === this.duration) {
                const centerX = (this.x1 + this.x2) / 2;
                const centerY = (this.y1 + this.y2) / 2;
                const explosion = new ExplosionEffect(centerX, centerY, this.resultColor, 25);
                this.particles.push(...explosion.particles);
            }
        }

        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => p.isAlive());
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }

    isFinished() {
        return this.progress > this.duration + 100;
    }
}

// ==================== CANVAS MANAGER ====================

class EffectsCanvas {
    constructor(elementId) {
        this.container = document.getElementById(elementId);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.effects = [];
        
        this.setupCanvas();
        this.animate();
    }

    setupCanvas() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = 400;
        this.canvas.style.display = 'block';
        this.canvas.style.borderRadius = '10px';
        this.canvas.style.background = 'linear-gradient(135deg, rgba(102,126,234,0.1), rgba(240,147,251,0.1))';
        this.canvas.style.marginTop = '20px';
        this.canvas.style.cursor = 'crosshair';
        this.container.appendChild(this.canvas);

        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = this.container.offsetWidth;
    }

    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const effects = [
            () => this.effects.push(new ExplosionEffect(x, y, '#667eea', 30)),
            () => this.effects.push(new ExplosionEffect(x, y, '#f093fb', 25)),
            () => this.effects.push(new ChainReaction(x, y, '#00d4aa', '#ffa502')),
            () => this.effects.push(new FloatingMolecule(x, y, 'H₂O', '#667eea'))
        ];

        effects[Math.floor(Math.random() * effects.length)]();
    }

    addEffect(effect) {
        this.effects.push(effect);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Aggiorna e disegna effetti
        this.effects.forEach(effect => {
            effect.update();
            effect.draw(this.ctx);
        });

        // Rimuovi effetti finiti
        this.effects = this.effects.filter(e => !e.isFinished());

        requestAnimationFrame(() => this.animate());
    }
}

// ==================== EFFETTO REAZIONE CHIMICA INTERATTIVO ====================

function createReactionAnimation(element, reagent1, reagent2, product, color1, color2, productColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 150;
    canvas.style.display = 'block';
    canvas.style.marginTop = '15px';
    
    const ctx = canvas.getContext('2d');
    let progress = 0;
    const duration = 120;

    function drawReaction() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const t = Math.min(progress / duration, 1);

        // Molecola 1
        if (t < 0.8) {
            const x1 = 40 - t * 20;
            ctx.fillStyle = color1;
            ctx.beginPath();
            ctx.arc(x1, 75, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(reagent1, x1, 75);
        }

        // Molecola 2
        if (t < 0.8) {
            const x2 = 260 + t * 20;
            ctx.fillStyle = color2;
            ctx.beginPath();
            ctx.arc(x2, 75, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(reagent2, x2, 75);
        }

        // Freccia
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(80, 75);
        ctx.lineTo(220, 75);
        ctx.stroke();

        // Punta freccia
        ctx.fillStyle = '#667eea';
        ctx.beginPath();
        ctx.moveTo(220, 75);
        ctx.lineTo(215, 70);
        ctx.lineTo(215, 80);
        ctx.closePath();
        ctx.fill();

        // Prodotto
        if (t > 0.5) {
            const opacity = Math.min((t - 0.5) / 0.3, 1);
            ctx.globalAlpha = opacity;
            ctx.fillStyle = productColor;
            ctx.beginPath();
            ctx.arc(150, 75, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;

            // Scintille
            for (let i = 0; i < 5; i++) {
                const angle = (i / 5) * Math.PI * 2 + t * 0.1;
                const distance = 35 + Math.sin(t * 0.1) * 5;
                const px = 150 + Math.cos(angle) * distance;
                const py = 75 + Math.sin(angle) * distance;
                
                ctx.fillStyle = productColor;
                ctx.globalAlpha = opacity * 0.6;
                ctx.beginPath();
                ctx.arc(px, py, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(product, 150, 75);
        }

        progress++;
        if (progress < duration * 3) {
            requestAnimationFrame(drawReaction);
        }
    }

    element.appendChild(canvas);
    drawReaction();
}

// ==================== EFFETTO TAVOLA PERIODICA INTERATTIVA ====================

function createPeriodicTableEffect() {
    const elements = [
        {symbol: 'H', name: 'Idrogeno', color: '#FF6B6B'},
        {symbol: 'O', name: 'Ossigeno', color: '#4ECDC4'},
        {symbol: 'C', name: 'Carbonio', color: '#95E1D3'},
        {symbol: 'N', name: 'Azoto', color: '#F38181'},
        {symbol: 'Na', name: 'Sodio', color: '#AA96DA'},
        {symbol: 'Cl', name: 'Cloro', color: '#FCBAD3'},
        {symbol: 'Ca', name: 'Calcio', color: '#A8D8EA'},
        {symbol: 'S', name: 'Zolfo', color: '#FFD3B6'}
    ];

    elements.forEach((el, index) => {
        const elem = document.querySelector(`.element:nth-child(${index + 1})`);
        if (!elem) return;

        elem.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.15) rotate(-5deg)';
            this.style.boxShadow = `0 10px 30px ${el.color}80`;
            this.style.filter = 'brightness(1.2) drop-shadow(0 0 10px ' + el.color + ')';

            // Crea particelle
            const canvas = document.createElement('canvas');
            canvas.width = 100;
            canvas.height = 100;
            canvas.style.position = 'absolute';
            canvas.style.pointerEvents = 'none';
            canvas.style.top = this.offsetTop - 20;
            canvas.style.left = this.offsetLeft - 20;
            
            const rect = this.getBoundingClientRect();
            canvas.style.position = 'fixed';
            canvas.style.top = rect.top - 20 + 'px';
            canvas.style.left = rect.left - 20 + 'px';

            document.body.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            let particleLife = 1;

            function drawParticles() {
                ctx.clearRect(0, 0, 100, 100);
                
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const distance = 20 + (1 - particleLife) * 50;
                    const x = 50 + Math.cos(angle) * distance;
                    const y = 50 + Math.sin(angle) * distance;

                    ctx.fillStyle = el.color;
                    ctx.globalAlpha = particleLife * 0.8;
                    ctx.beginPath();
                    ctx.arc(x, y, 3, 0, Math.PI * 2);
                    ctx.fill();
                }

                particleLife -= 0.05;
                
                if (particleLife > 0) {
                    requestAnimationFrame(drawParticles);
                } else {
                    document.body.removeChild(canvas);
                }
            }

            drawParticles();
        });

        elem.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
            this.style.filter = 'brightness(1)';
        });

        elem.addEventListener('click', function() {
            createTooltipEffect(this, el.name, el.symbol);
        });
    });
}

// ==================== EFFETTO TOOLTIP CHIMICO ====================

function createTooltipEffect(element, name, symbol) {
    const tooltip = document.createElement('div');
    tooltip.style.position = 'fixed';
    tooltip.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '15px 25px';
    tooltip.style.borderRadius = '10px';
    tooltip.style.fontSize = '14px';
    tooltip.style.fontWeight = 'bold';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.zIndex = '9999';
    tooltip.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
    tooltip.style.animation = 'popIn 0.3s ease-out';
    tooltip.innerHTML = `${symbol}<br><small>${name}</small>`;

    const rect = element.getBoundingClientRect();
    tooltip.style.top = (rect.top - 60) + 'px';
    tooltip.style.left = (rect.left + rect.width / 2 - 40) + 'px';

    document.body.appendChild(tooltip);

    setTimeout(() => {
        tooltip.style.animation = 'popOut 0.3s ease-out';
        setTimeout(() => document.body.removeChild(tooltip), 300);
    }, 2000);
}

// ==================== EFFETTO REAZIONE IN TEMPO REALE ====================

function createRealtimeReaction(container, reactions) {
    const canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth - 40;
    canvas.height = 300;
    canvas.style.borderRadius = '10px';
    canvas.style.background = 'radial-gradient(circle at 30% 30%, rgba(240,147,251,0.1), rgba(102,126,234,0.05))';
    canvas.style.marginTop = '20px';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let time = 0;
    const molecules = [];

    // Crea molecole
    reactions.forEach((reaction, idx) => {
        for (let i = 0; i < 3; i++) {
            molecules.push({
                x: Math.random() * canvas.width,
                y: Math.random() * (canvas.height - 100) + 50,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 8 + 4,
                color: ['#667eea', '#764ba2', '#f093fb', '#00d4aa'][idx % 4],
                life: 1,
                symbol: reaction.symbol
            });
        }
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time++;

        // Aggiorna molecole
        molecules.forEach(mol => {
            mol.x += mol.vx;
            mol.y += mol.vy;
            mol.life -= 0.001;

            // Rimbalza dai bordi
            if (mol.x < 0 || mol.x > canvas.width) mol.vx *= -1;
            if (mol.y < 0 || mol.y > canvas.height) mol.vy *= -1;

            // Mantieni nel canvas
            mol.x = Math.max(0, Math.min(canvas.width, mol.x));
            mol.y = Math.max(0, Math.min(canvas.height, mol.y));

            // Disegna molecola
            ctx.fillStyle = mol.color;
            ctx.globalAlpha = mol.life * 0.8;
            ctx.beginPath();
            ctx.arc(mol.x, mol.y, mol.size, 0, Math.PI * 2);
            ctx.fill();

            // Glow effect
            ctx.strokeStyle = mol.color;
            ctx.lineWidth = 1;
            ctx.globalAlpha = mol.life * 0.4;
            ctx.stroke();

            // Particelle di coda
            ctx.globalAlpha = mol.life * 0.3;
            ctx.fillStyle = mol.color;
            for (let i = 1; i < 3; i++) {
                const trailX = mol.x - mol.vx * i * 3;
                const trailY = mol.y - mol.vy * i * 3;
                ctx.beginPath();
                ctx.arc(trailX, trailY, mol.size / (i + 1), 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.globalAlpha = 1;
        });

        // Disegna etichette
        ctx.fillStyle = '#667eea';
        ctx.font = 'bold 12px Arial';
        ctx.globalAlpha = 0.6;
        molecules.slice(0, 3).forEach((mol, idx) => {
            ctx.fillText(mol.symbol, 20 + idx * 100, 30);
        });
        ctx.globalAlpha = 1;

        if (molecules.some(m => m.life > 0)) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

// ==================== EFFETTO ESPLOSIONE CHIMICA ====================

function createChemicalExplosion(element) {
    const rect = element.getBoundingClientRect();
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '10000';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let particles = [];

    // Crea particelle esplosive
    for (let i = 0; i < 50; i++) {
        const angle = (i / 50) * Math.PI * 2;
        const speed = 3 + Math.random() * 5;
        particles.push({
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            size: Math.random() * 8 + 2,
            color: ['#667eea', '#764ba2', '#f093fb', '#00d4aa', '#ff6b6b'][Math.floor(Math.random() * 5)]
        });
    }

    // Onde di shock
    let shockWaves = [];
    for (let i = 0; i < 3; i++) {
        shockWaves.push({
            radius: 0,
            maxRadius: 200 + i * 50,
            life: 1,
            speed: 2 + i * 0.5
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Disegna onde di shock
        shockWaves.forEach(wave => {
            ctx.strokeStyle = '#667eea';
            ctx.globalAlpha = wave.life * 0.5;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(centerX, centerY, wave.radius, 0, Math.PI * 2);
            ctx.stroke();

            wave.radius += wave.speed;
            wave.life -= 0.02;
        });

        // Disegna particelle
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.15; // Gravità
            p.life -= 0.01;

            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life * 0.8;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.globalAlpha = 1;

        if (particles.some(p => p.life > 0) || shockWaves.some(w => w.life > 0)) {
            requestAnimationFrame(animate);
        } else {
            document.body.removeChild(canvas);
        }
    }

    animate();
}

// ==================== EFFETTO GLOW DINAMICO ====================

function createGlowEffect(element, color) {
    element.style.transition = 'all 0.3s ease';
    
    const originalBoxShadow = element.style.boxShadow;
    let glowIntensity = 0;
    let increasing = true;

    function pulse() {
        if (increasing) {
            glowIntensity += 0.05;
            if (glowIntensity >= 1) increasing = false;
        } else {
            glowIntensity -= 0.05;
            if (glowIntensity <= 0) increasing = true;
        }

        const blur = 10 + glowIntensity * 20;
        const spread = 2 + glowIntensity * 5;
        element.style.boxShadow = `0 0 ${blur}px ${spread}px ${color}80`;

        if (element.parentElement) {
            requestAnimationFrame(pulse);
        }
    }

    pulse();
}

// ==================== ANIMATE CSS IN ====================

const style = document.createElement('style');
style.textContent = `
    @keyframes popIn {
        0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
        }
        100% {
            transform: scale(1) rotate(0);
            opacity: 1;
        }
    }

    @keyframes popOut {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(0) rotate(180deg);
            opacity: 0;
        }
    }

    @keyframes chemicalPulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }

    @keyframes reactingGlow {
        0% {
            box-shadow: 0 0 5px rgba(102,126,234,0.3);
        }
        50% {
            box-shadow: 0 0 20px rgba(102,126,234,0.8);
        }
        100% {
            box-shadow: 0 0 5px rgba(102,126,234,0.3);
        }
    }
`;
document.head.appendChild(style);

// ==================== INIT EFFECTS ====================

document.addEventListener('DOMContentLoaded', function() {
    // Inizializza effetti periodici
    createPeriodicTableEffect();

    // Aggiungi effetti ai pulsanti
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', function() {
            createChemicalExplosion(this);
        });
    });

    console.log('✨ Effetti chimici caricati e attivi!');
});

// Esporta per uso esterno
window.ChemicalEffects = {
    ExplosionEffect,
    ChemicalParticle,
    FloatingMolecule,
    ChainReaction,
    ChemicalMerge,
    EffectsCanvas,
    createReactionAnimation,
    createRealtimeReaction,
    createChemicalExplosion,
    createGlowEffect,
    createPeriodicTableEffect
};
