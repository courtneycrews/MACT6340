//code based on turorial from Frank's labratory YouTube channel https://www.youtube.com/@Frankslaboratory

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle = 'black';
ctx.strokeStyle = 'black';


class Particle {

    constructor(effect) {
        this.effect = effect;
        this.radius = Math.floor(Math.random() * 20 + 15);
        this.buffer = this.radius * 4;
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
        this.vx = Math.random() * 1 - 0.5;
        this.vy = Math.random() * 1 - 0.5;
        this.pushX = 0;
        this.pushY = 0;
        this.friction = 0.9;
        this.margin = 80;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
    }

    update(){
        const dx = this.x - this.effect.mouse.x;
        const dy = this.y - this.effect.mouse.y;
        const distance = Math.hypot(dx, dy);
        const force = (distance/this.effect.mouse.radius);
        if (distance < this.effect.mouse.radius){
            const angle = Math.atan2(dy, dx);
            this.pushX -= Math.cos(angle) * force;
            this.pushY -= Math.sin(angle) * force;
    }

        this.x += (this.pushX *= this.friction) + this.vx;
        this.y += (this.pushY *= this.friction) + this.vy;

        // Check for collisions with the inner boundary (considering the margin)
        if (this.x - this.radius < this.margin) {
            this.x = this.radius + this.margin;
            this.vx *= -1;
        }
        if (this.x + this.radius > this.effect.width - this.margin) {
            this.x = this.effect.width - this.radius - this.margin;
            this.vx *= -1;
        }
        if (this.y - this.radius < this.margin) {
            this.y = this.radius + this.margin;
            this.vy *= -1;
        }
        if (this.y + this.radius > this.effect.height - this.margin) {
            this.y = this.effect.height - this.radius - this.margin;
            this.vy *= -1;
        }
    }

    //     // Calculate distance from the canvas center
    // const centerX = this.effect.width / 2;
    // const centerY = this.effect.height / 2;
    // const distanceToCenter = Math.hypot(this.x - centerX, this.y - centerY);

    // // Set a radius for the circular boundary (e.g., 1/3 of canvas width)
    // const circularRadius = this.effect.width / 4;

    // // If particle exceeds the circular boundary, adjust its position
    // if (distanceToCenter > circularRadius - this.radius) {
    //     // Calculate angle to center
    //     const angleToCenter = Math.atan2(centerY - this.y, centerX - this.x);

    //     // Move particle back inside the circular boundary
    //     this.x = centerX - Math.cos(angleToCenter) * (circularRadius - this.radius);
    //     this.y = centerY - Math.sin(angleToCenter) * (circularRadius - this.radius);

    //     // Reflect velocity based on angle
    //     const normalAngle = Math.atan2(this.vy, this.vx);
    //     const reflectionAngle = 2 * angleToCenter - normalAngle;
    //     const speed = Math.hypot(this.vx, this.vy);
    //     this.vx = Math.cos(reflectionAngle) * speed;
    //     this.vy = Math.sin(reflectionAngle) * speed;
    // }
    // }

    reset() {
        this.x = this.radius + this.margin + Math.random() * (this.effect.width - this.radius * 2 - this.margin * 2);
        this.y = this.radius + this.margin + Math.random() * (this.effect.height - this.radius * 2 - this.margin * 2);
    }
}

class Effect {
    constructor(canvas, context){
        this.canvas = canvas;
        this.context = context;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = 350;
        this.createParticles();

        this.mouse = {
            x: 0,
            y: 0,
            radius: 200,
        }

        window.addEventListener('resize', e => {
            this.resize(e.target.window.innerWidth, e.target.window.innerHeight)
        });
        window.addEventListener('mousemove', e => {
                this.mouse.x = e.x;
                this.mouse.y = e.y;
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
        this.context.fillStyle = 'black';
        this.context.strokeStyle = 'black';
        this.particles.forEach(particle => {
            particle.reset();
        });
    }
}
const effect = new Effect(canvas, ctx);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.handleParticles(ctx);
    requestAnimationFrame(animate);
}
animate();