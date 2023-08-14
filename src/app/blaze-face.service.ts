import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';

@Injectable({
  providedIn: 'root',
})
export class BlazeFaceService {
  constructor() {
    // Initialize TensorFlow.js with the WebGL backend
    tf.setBackend('webgl');
  }
  private model!: blazeface.BlazeFaceModel; // Use non-null assertion operator

  async loadModel() {
    this.model = await blazeface.load();
  }

  async detectFaces(imageData: ImageData): Promise<blazeface.NormalizedFace[]> {
    console.log("Detecting faces...");
    if (!this.model) {
      throw new Error('Model not loaded yet.');
    }

    const predictions = await this.model.estimateFaces(imageData);
    return predictions;
  }
}
