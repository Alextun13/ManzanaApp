import * as tf from '@tensorflow/tfjs';

export class MlService {
  private model: tf.LayersModel | undefined;

  async loadModel(): Promise<void> {
    this.model = await tf.loadLayersModel('assets/model/model.json');
  }

  async predictFromImageData(imageData: ImageData): Promise<number> {
    if (!this.model) throw new Error('Modelo no cargado');

    const tensor = tf.browser.fromPixels(imageData)
      .resizeNearestNeighbor([224, 224]) // adapta según lo que el modelo espera
      .toFloat()
      .div(tf.scalar(255.0))
      .expandDims(); // [1, 224, 224, 3]

    const prediction = this.model.predict(tensor) as tf.Tensor;
    const result = await prediction.data();
    return result[0]; // para clasificación binaria
  }
}
