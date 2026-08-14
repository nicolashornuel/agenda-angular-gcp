import { Directive, Input } from '@angular/core';
import { AudioNodeAnalyser } from '../abstracts/audioDirective.abstract';

@Directive({
  selector: '[audioAnalyserParticle]'
})
export class AudioAnalyserParticleDirective extends AudioNodeAnalyser {

  @Input() sensitivity: number = 100; // Nouveau paramètre d'entrée
  @Input() particleNumber: number = 10; // Nombre de particules
  private particles: any[] = [];

  protected draw(bufferLength: number, dataArray: Uint8Array): void {
    this.particles = this.initializeParticles();
    this.drawParticles(dataArray);
    this.animate();
  }

  animate() {
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const timeDataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);
    this.analyser.getByteTimeDomainData(timeDataArray);
    this.drawParticles(dataArray);
    requestAnimationFrame(() => this.animate());
  }

  initializeParticles() {
    const particles = [];
    for (let i = 0; i < this.particleNumber; i++) {
      particles.push({
        x: Math.random() * 800,
        y: Math.random() * 300,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        color: `rgba(255, 170, 0, ${Math.random() * 0.5})` // || `hsl(${Math.random() * 360}, 70%, 60%)`
      });
    }
    return particles;
  }

  // Effet 3: Particules réactives
  drawParticles(dataArray: Uint8Array) {
    const { width, height } = this.canvas.nativeElement;

    const avgAmplitude = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
    const energy = (avgAmplitude / 255) * this.sensitivity;

    this.particles.forEach((particle, index) => {
      const frequencyData = dataArray[index % dataArray.length];
      const force = (frequencyData / 255) * energy;

      particle.vx += (Math.random() - 0.5) * force;
      particle.vy += (Math.random() - 0.5) * force;

      particle.x += particle.vx;
      particle.y += particle.vy;

      // Rebond sur les bords
      if (particle.x < 0 || particle.x > width) particle.vx *= -0.8;
      if (particle.y < 0 || particle.y > height) particle.vy *= -0.8;

      particle.x = Math.max(0, Math.min(width, particle.x));
      particle.y = Math.max(0, Math.min(height, particle.y));

      // Friction
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      // Dessiner la particule
      this.canvasCtx.beginPath();
      this.canvasCtx.arc(particle.x, particle.y, particle.size + force * 3, 0, Math.PI * 2);
      this.canvasCtx.fillStyle = particle.color;
      this.canvasCtx.fill();
    });
  }
}
