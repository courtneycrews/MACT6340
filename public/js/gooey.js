//original code sourced from Frank's labratory YouTube channel tutorials https://www.youtube.com/@Frankslaboratory

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle = 'black';
ctx.strokeStyle = 'black';


class Particle {

    constructor(effect) {
        this.effect = effect;
        this.radius = Math.floor(Math.random() * 15 + 10);
        this.buffer = this.radius * 4;
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
        this.vx = Math.random() * 1 - 0.5;
        this.vy = Math.random() * 1 - 0.5;
        this.pushX = 0;
        this.pushY = 0;
        this.friction = 0.9;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
    }

    update(){
        if (this.effect.mouse.pressed){
            const dx = this.x - this.effect.mouse.x;
            const dy = this.y - this.effect.mouse.y;
            const distance = Math.hypot(dx, dy);
            const force = (distance/this.effect.mouse.radius);
            if (distance < this.effect.mouse.radius){
                const angle = Math.atan2(dy, dx);
                this.pushX -= Math.cos(angle) * force;
                this.pushY -= Math.sin(angle) * force;
            }
        }

        this.x += (this.pushX *= this.friction) + this.vx;
        this.y += (this.pushY *= this.friction) + this.vy;


        // Calculate distance from the canvas center
    const centerX = this.effect.width / 2;
    const centerY = this.effect.height / 2;
    const distanceToCenter = Math.hypot(this.x - centerX, this.y - centerY);

    // Set a radius for the circular boundary (e.g., 1/3 of canvas width)
    const circularRadius = this.effect.width / 3;

    // If particle exceeds the circular boundary, adjust its position
    if (distanceToCenter > circularRadius - this.radius) {
        // Calculate angle to center
        const angleToCenter = Math.atan2(centerY - this.y, centerX - this.x);

        // Move particle back inside the circular boundary
        this.x = centerX - Math.cos(angleToCenter) * (circularRadius - this.radius);
        this.y = centerY - Math.sin(angleToCenter) * (circularRadius - this.radius);

        // Reflect velocity based on angle
        const normalAngle = Math.atan2(this.vy, this.vx);
        const reflectionAngle = 2 * angleToCenter - normalAngle;
        const speed = Math.hypot(this.vx, this.vy);
        this.vx = Math.cos(reflectionAngle) * speed;
        this.vy = Math.sin(reflectionAngle) * speed;
    }
    }

reset() {
    this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
    this.color = particleColors[Math.floor(Math.random() * particleColors.length)]; // Reset color
}
}

class Effect {
    constructor(canvas, context){
        this.canvas = canvas;
        this.context = context;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = 300;
        this.createParticles();

        this.mouse = {
            x: 0,
            y: 0,
            pressed: false,
            radius: 200,
        }

        window.addEventListener('resize', e => {
            this.resize(e.target.window.innerWidth, e.target.window.innerHeight)
        });
        window.addEventListener('mousemove', e => {
            if (this.mouse.pressed){
                this.mouse.x = e.x;
                this.mouse.y = e.y;
            }
        });
        window.addEventListener('mousedown', e=> {
            this.mouse.pressed = true;
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        window.addEventListener('mouseup', e => {
            this.mouse.pressed = false;
        });
    }
    createParticles(){
        for (let i = 0; i < this.numberOfParticles; i++){
            this.particles.push(new Particle(this));
        }
    }
    handleParticles(context){
        this.connectParticles(context);
        this.particles.forEach(particle => {
            particle.draw(context);
            particle.update();
        });
    }
    connectParticles(context){
        const maxDistance = 80;
        for (let a = 0; a < this.particles.length; a++){ 
            for (let b = a; b < this.particles.length; b++){
                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                const distance = Math.hypot(dx, dy);
                if (distance < maxDistance){
                    context.save();
                    const opacity = 1 - (distance/maxDistance);
                    context.globalAlpha = opacity;
                    context.beginPath();
                    context.moveTo(this.particles[a].x, this.particles[a].y);
                    context.lineTo(this.particles[b].x, this.particles[b].y);
                    context.stroke();
                    context.restore();
                }
            }
        }
    }
    resize(width, height){
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
        this.context.fillStyle = 'white';
        this.context.strokeStyle = 'white';
        this.particles.forEach(particle => {
            particle.reset();
        })
    }
}
const effect = new Effect(canvas, ctx);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.handleParticles(ctx);
    requestAnimationFrame(animate);
}
animate();