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

// src/app/home/home.page.ts

// src/app/home/home.page.ts

import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false, // Cambiado a false para Ionic
})
export class HomePage {
  imageSrc = '';
  prediction = '📷 Pulsa el botón para tomar una foto';
  model: tf.GraphModel | null = null;

  async ionViewDidEnter() {
    await this.loadModel();
  }

  async loadModel() {
    try {
      this.model = await tf.loadGraphModel('assets/model/model.json');
      console.log('✅ Modelo cargado');
    } catch (error) {
      console.error('❌ Error al cargar el modelo:', error);
    }
  }

  async capturarFoto() {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 90
      });

      if (!photo?.dataUrl) return;

      this.imageSrc = photo.dataUrl;
      this.prediction = '🔍 Analizando imagen...';

      const img = new Image();
      img.src = photo.dataUrl;
      img.onload = async () => {
        const tensor = tf.browser.fromPixels(img).resizeNearestNeighbor([224, 224])
          .toFloat().div(255).expandDims(0);

        const result = this.model!.predict(tensor) as tf.Tensor;
        const data = await result.data();

        const idx = data.indexOf(Math.max(...data));
        this.prediction = idx === 0 ? '🍏 Manzana saludable' : '🍎 Manzana podrida';

        tf.dispose([tensor, result]);
      };
    } catch (err) {
      console.error('❌ Error al capturar o procesar la imagen:', err);
      this.prediction = '⚠️ No se pudo analizar la imagen';
    }
  }
}
