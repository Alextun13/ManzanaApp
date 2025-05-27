import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  async takePicture(): Promise<string | undefined> {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });
      return image.dataUrl;
    } catch (error) {
      console.error('Error al capturar la imagen:', error);
      return undefined;
    }
  }
}
