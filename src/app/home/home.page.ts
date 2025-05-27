import { Component, ViewChild, ElementRef } from '@angular/core';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  @ViewChild('video') videoElement!: ElementRef;
  model!: cocoSsd.ObjectDetection;
  result?: string;
  isCameraActive = false;

  async ngOnInit() {
    this.model = await cocoSsd.load(); // Cargar modelo YOLO al inicio
  }

  async startDetection() {
    const video = this.videoElement.nativeElement;
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    this.isCameraActive = true;
    
    this.detectObjects(video);
  }

  async detectObjects(video: HTMLVideoElement) {
    setInterval(async () => {
      if (!this.isCameraActive || !this.model) return;

      const predictions = await this.model.detect(video);
      console.log('Objetos detectados:', predictions); // Para verificar la detección

      this.result = predictions.some(p => p.class === 'apple')
        ? '🍏 Manzana detectada'
        : '❌ No se detecta manzana';
    }, 1000); // Procesar cada segundo
  }
}
