// Face Recognition Engine using face-api.js
import * as faceapi from 'face-api.js';

export interface FaceDescriptor {
  userId: string;
  descriptor: Float32Array;
  timestamp: number;
  name?: string;
}

export class FaceEngine {
  private modelsLoaded = false;
  private faceDescriptors: Map<string, FaceDescriptor> = new Map();
  private readonly MIN_CONFIDENCE = 0.6;
  private readonly MAX_DISTANCE = 0.6; // Euclidean distance threshold

  async initialize(): Promise<void> {
    if (this.modelsLoaded) return;

    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      ]);
      this.modelsLoaded = true;
      console.log('Face API models loaded successfully');
    } catch (error) {
      console.error('Failed to load face API models:', error);
      throw new Error('Face recognition models failed to load');
    }
  }

  async detectFace(input: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement) {
    if (!this.modelsLoaded) await this.initialize();

    try {
      const detection = await faceapi
        .detectSingleFace(input, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      return detection;
    } catch (error) {
      console.error('Face detection error:', error);
      return null;
    }
  }

  async extractFaceDescriptor(input: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement) {
    const detection = await this.detectFace(input);
    if (!detection) return null;
    return detection.descriptor;
  }

  enrollFace(userId: string, descriptor: Float32Array, name?: string): void {
    this.faceDescriptors.set(userId, {
      userId,
      descriptor,
      timestamp: Date.now(),
      name,
    });
  }

  async verifyFace(input: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): Promise<{userId: string; confidence: number} | null> {
    const liveDescriptor = await this.extractFaceDescriptor(input);
    if (!liveDescriptor) return null;

    let bestMatch: {userId: string; confidence: number} | null = null;
    let minDistance = this.MAX_DISTANCE;

    for (const [, stored] of this.faceDescriptors) {
      const distance = this.euclideanDistance(liveDescriptor, stored.descriptor);
      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = {
          userId: stored.userId,
          confidence: 1 - (distance / this.MAX_DISTANCE), // Convert distance to confidence
        };
      }
    }

    return bestMatch && bestMatch.confidence > this.MIN_CONFIDENCE ? bestMatch : null;
  }

  private euclideanDistance(a: Float32Array, b: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      sum += Math.pow(a[i] - b[i], 2);
    }
    return Math.sqrt(sum);
  }

  getFaceDescriptors(): FaceDescriptor[] {
    return Array.from(this.faceDescriptors.values());
  }

  clearDescriptor(userId: string): boolean {
    return this.faceDescriptors.delete(userId);
  }

  exportData(): string {
    const data = Array.from(this.faceDescriptors.values()).map(desc => ({
      ...desc,
      descriptor: Array.from(desc.descriptor),
    }));
    return JSON.stringify(data);
  }

  importData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      data.forEach((item: any) => {
        this.enrollFace(
          item.userId,
          new Float32Array(item.descriptor),
          item.name
        );
      });
    } catch (error) {
      console.error('Failed to import face data:', error);
    }
  }
}

export const faceEngine = new FaceEngine();
