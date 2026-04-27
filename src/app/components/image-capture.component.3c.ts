/**
 * Image Capture Component
 * Student: BoLi
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part1 Phase 3c
 * Description: Ionic component for capturing and displaying images
 */

import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CameraService3c } from '../services/camera.service.3c';

@Component({
  selector: 'app-image-capture',
  template: `
    <div class="image-capture-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Item Image</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div class="image-preview" *ngIf="capturedImage">
            <img [src]="capturedImage" alt="Captured image" />
            <ion-button color="danger" size="small" (click)="removeImage()">
              <ion-icon name="trash-outline"></ion-icon>
            </ion-button>
          </div>
          
          <div class="placeholder" *ngIf="!capturedImage">
            <ion-icon name="image-outline" class="placeholder-icon"></ion-icon>
            <p>No image captured</p>
          </div>

          <ion-row class="action-buttons">
            <ion-col>
              <ion-button expand="block" (click)="capturePhoto()">
                <ion-icon name="camera-outline" slot="start"></ion-icon>
                Camera
              </ion-button>
            </ion-col>
            <ion-col>
              <ion-button expand="block" (click)="selectFromGallery()">
                <ion-icon name="images-outline" slot="start"></ion-icon>
                Gallery
              </ion-button>
            </ion-col>
          </ion-row>

          <ion-item *ngIf="errorMessage">
            <ion-text color="danger">{{ errorMessage }}</ion-text>
          </ion-item>
        </ion-card-content>
      </ion-card>
    </div>
  `,
  styles: [`
    .image-capture-container {
      padding: 16px;
    }
    
    .image-preview {
      position: relative;
      margin-bottom: 16px;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .image-preview img {
      width: 100%;
      height: auto;
      max-height: 300px;
      object-fit: cover;
    }
    
    .image-preview ion-button {
      position: absolute;
      top: 8px;
      right: 8px;
    }
    
    .placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      background: #f5f5f5;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    
    .placeholder-icon {
      font-size: 64px;
      color: #ccc;
      margin-bottom: 8px;
    }
    
    .action-buttons {
      margin-top: 16px;
    }
  `],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ImageCaptureComponent {
  @Output() imageCaptured = new EventEmitter<string>();
  @Output() imageRemoved = new EventEmitter<void>();

  capturedImage: string | null = null;
  errorMessage: string | null = null;

  constructor(private cameraService: CameraService3c) {}

  async capturePhoto(): Promise<void> {
    this.errorMessage = null;
    const imageData = await this.cameraService.capturePhoto();
    
    if (imageData) {
      this.capturedImage = this.cameraService.getImageDataUrl(imageData);
      this.imageCaptured.emit(imageData);
    } else {
      this.errorMessage = 'Failed to capture photo. Please try again.';
    }
  }

  async selectFromGallery(): Promise<void> {
    this.errorMessage = null;
    const imageData = await this.cameraService.selectFromGallery();
    
    if (imageData) {
      this.capturedImage = this.cameraService.getImageDataUrl(imageData);
      this.imageCaptured.emit(imageData);
    } else {
      this.errorMessage = 'Failed to select image. Please try again.';
    }
  }

  removeImage(): void {
    this.capturedImage = null;
    this.imageRemoved.emit();
  }

  getImageBase64(): string | null {
    if (!this.capturedImage) return null;
    return this.capturedImage.replace(/^data:image\/\w+;base64,/, '');
  }
}
