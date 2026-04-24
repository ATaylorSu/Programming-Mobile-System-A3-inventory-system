/**
 * Location Picker Page - Geolocation Integration Demo
 * Student: BoLi
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part1 Phase 3c
 * Description: Page demonstrating geolocation feature integration
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { GeolocationService3c, LocationData } from '../services/geolocation.service.3c';
import { CameraService3c } from '../services/camera.service.3c';

@Component({
  selector: 'app-location-picker-page',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Location Picker</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="showHelp()">
            <ion-icon name="help-circle-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="ion-padding">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Get Current Location</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>Tap the button below to get your current location coordinates.</p>
            
            <ion-button expand="block" (click)="getLocation()" [disabled]="loading">
              <ion-icon name="location-outline" slot="start"></ion-icon>
              {{ loading ? 'Getting Location...' : 'Get Location' }}
            </ion-button>

            <div class="location-result" *ngIf="location">
              <ion-item>
                <ion-label>
                  <h3>Latitude</h3>
                  <p>{{ location.latitude.toFixed(6) }}</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <h3>Longitude</h3>
                  <p>{{ location.longitude.toFixed(6) }}</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <h3>Accuracy</h3>
                  <p>{{ location.accuracy.toFixed(2) }} meters</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <h3>Formatted</h3>
                  <p>{{ formatCoords(location.latitude, location.longitude) }}</p>
                </ion-label>
              </ion-item>
            </div>

            <ion-text color="danger" *ngIf="error">{{ error }}</ion-text>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Capture with Location</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>Capture an image with location data for inventory tracking.</p>
            
            <ion-button expand="block" color="secondary" (click)="captureWithLocation()" [disabled]="loading">
              <ion-icon name="camera" slot="start"></ion-icon>
              Capture Photo with Location
            </ion-button>

            <div class="capture-result" *ngIf="capturedData">
              <div class="image-preview">
                <img [src]="capturedData.imageUrl" alt="Captured" />
              </div>
              <ion-item>
                <ion-label>
                  <h3>Captured at</h3>
                  <p>{{ formatCoords(capturedData.latitude, capturedData.longitude) }}</p>
                </ion-label>
              </ion-item>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styles: [`
    .location-result, .capture-result {
      margin-top: 16px;
    }
    
    .image-preview {
      margin-bottom: 16px;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .image-preview img {
      width: 100%;
      max-height: 300px;
      object-fit: cover;
    }
  `],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class LocationPickerPageComponent {
  loading = false;
  location: LocationData | null = null;
  error: string | null = null;
  capturedData: { imageUrl: string; latitude: number; longitude: number } | null = null;

  constructor(
    private geolocationService: GeolocationService3c,
    private cameraService: CameraService3c
  ) {}

  async getLocation(): Promise<void> {
    this.loading = true;
    this.error = null;
    this.location = null;

    try {
      const position = await this.geolocationService.getCurrentPosition();
      
      if (position) {
        this.location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };
      } else {
        this.error = 'Failed to get location. Please check your permissions.';
      }
    } catch (err: any) {
      this.error = err.message || 'An error occurred';
    } finally {
      this.loading = false;
    }
  }

  async captureWithLocation(): Promise<void> {
    this.loading = true;
    this.error = null;
    this.capturedData = null;

    try {
      const position = await this.geolocationService.getCurrentPosition();
      const imageData = await this.cameraService.capturePhoto();

      if (imageData && position) {
        this.capturedData = {
          imageUrl: this.cameraService.getImageDataUrl(imageData),
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
      } else if (!position) {
        this.error = 'Failed to get location for this capture.';
      } else if (!imageData) {
        this.error = 'Failed to capture image.';
      }
    } catch (err: any) {
      this.error = err.message || 'An error occurred';
    } finally {
      this.loading = false;
    }
  }

  formatCoords(lat: number, lon: number): string {
    return this.geolocationService.formatCoordinates(lat, lon);
  }

  showHelp(): void {
    console.log('Location Picker Help: Use this feature to tag inventory items with location data.');
  }
}
