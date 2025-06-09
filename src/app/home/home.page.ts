/*
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
*/

import { Component, ViewChild, ElementRef } from '@angular/core';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  @ViewChild('video', { static: false }) videoElement!: ElementRef;
  model!: tf.LayersModel;
  result?: string;
  isCameraActive = false;

  async ngOnInit() {
    this.model = await tf.loadLayersModel('assets/model/model.json');
    console.log('✅ Modelo cargado');
  }

  async startDetection() {
    const video = this.videoElement.nativeElement;
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    this.isCameraActive = true;

    video.onloadedmetadata = () => {
      video.play();
      this.detectFrame(video);
    };
  }

  async detectFrame(video: HTMLVideoElement) {
    const process = async () => {
      if (!this.isCameraActive || !this.model) return;

      const tensor = tf.tidy(() => {
        const frameTensor = tf.browser
          .fromPixels(video)
          .resizeNearestNeighbor([224, 224]) // Ajusta según el input shape de tu modelo
          .toFloat()
          .div(tf.scalar(255))
          .expandDims(0); // Añadir dimensión batch
        return frameTensor;
      });

      const prediction = this.model.predict(tensor) as tf.Tensor;
      const resultArray = await prediction.data();

      // Suponiendo salida binaria [prob_sano, prob_podrido]
      const maxIndex = resultArray[0] > resultArray[1] ? 0 : 1;
      this.result = maxIndex === 0 ? '✅ Manzana sana' : '⚠️ Manzana podrida';

      tf.dispose([tensor, prediction]);

      setTimeout(() => this.detectFrame(video), 1000); // Repite cada segundo
    };

    process();
  }

  stopCamera() {
    const video = this.videoElement.nativeElement;
    const stream = video.srcObject as MediaStream;
    stream.getTracks().forEach(track => track.stop());
    this.isCameraActive = false;
    this.result = undefined;
  }
}
