/**
 * Camera Service - Ionic Native Integration
 * Student: BoLi
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part1 Phase 3c
 * Description: Camera and image picker integration using Ionic Native
 * 
 * Features:
 * - Capture photos using device camera
 * - Select images from gallery
 * - Image compression and optimization
 * - Preview functionality
 */

import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CameraService3c {
  private readonly DEFAULT_QUALITY = 90;
  private readonly MAX_WIDTH = 1024;
  private readonly MAX_HEIGHT = 1024;

  constructor(private loadingCtrl: LoadingController) {}

  /**
   * Check if camera is available on the device
   */
  async isCameraAvailable(): Promise<boolean> {
    try {
      const permission = await Camera.checkPermissions();
      return permission.camera === 'granted' || permission.photos === 'granted';
    } catch {
      return false;
    }
  }

  /**
   * Request camera permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const result = await Camera.requestPermissions();
      return result.camera === 'granted' || result.photos === 'granted';
    } catch {
      return false;
    }
  }

  /**
   * Capture a photo using the device camera
   * @returns Base64 encoded image string or null if cancelled
   */
  async capturePhoto(): Promise<string | null> {
    const hasPermission = await this.requestPermissions();
    
    if (!hasPermission) {
      console.error('Camera permission denied');
      return null;
    }

    const options = {
      quality: this.DEFAULT_QUALITY,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      width: this.MAX_WIDTH,
      height: this.MAX_HEIGHT
    };

    try {
      const loading = await this.loadingCtrl.create({
        message: 'Capturing photo...'
      });
      await loading.present();

      const imageData = await Camera.getPhoto(options);
      await loading.dismiss();

      return imageData.base64String || null;
    } catch (error: any) {
      console.error('Error capturing photo:', error);
      if (error.message !== 'User cancelled photos') {
        await this.loadingCtrl.dismiss();
      }
      return null;
    }
  }

  /**
   * Select an image from the device gallery
   * @returns Base64 encoded image string or null if cancelled
   */
  async selectFromGallery(): Promise<string | null> {
    const hasPermission = await this.requestPermissions();

    if (!hasPermission) {
      console.error('Photos permission denied');
      return null;
    }

    const options = {
      quality: this.DEFAULT_QUALITY,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
      width: this.MAX_WIDTH,
      height: this.MAX_HEIGHT
    };

    try {
      const loading = await this.loadingCtrl.create({
        message: 'Selecting image...'
      });
      await loading.present();

      const imageData = await Camera.getPhoto(options);
      await loading.dismiss();

      return imageData.base64String || null;
    } catch (error: any) {
      console.error('Error selecting image:', error);
      if (error.message !== 'User cancelled photos') {
        await this.loadingCtrl.dismiss();
      }
      return null;
    }
  }

  /**
   * Save image to app's file system
   * @param base64Data Base64 encoded image
   * @param filename File name for the image
   * @returns File path or null if failed
   */
  async saveImageToFilesystem(base64Data: string, filename: string): Promise<string | null> {
    if (!Capacitor.isNativePlatform()) {
      console.warn('Filesystem API only available on native platforms');
      return null;
    }

    try {
      const savedFile = await Filesystem.writeFile({
        path: `images/${filename}`,
        data: base64Data,
        directory: Directory.Data
      });
      return savedFile.uri;
    } catch (error) {
      console.error('Error saving image:', error);
      return null;
    }
  }

  /**
   * Read image from app's file system
   * @param filepath Path to the image file
   * @returns Base64 encoded image or null if failed
   */
  async readImageFromFilesystem(filepath: string): Promise<string | null> {
    if (!Capacitor.isNativePlatform()) {
      console.warn('Filesystem API only available on native platforms');
      return null;
    }

    try {
      const file = await Filesystem.readFile({
        path: filepath,
        directory: Directory.Data
      });
      return typeof file.data === 'string' ? file.data : null;
    } catch (error) {
      console.error('Error reading image:', error);
      return null;
    }
  }

  /**
   * Delete image from app's file system
   * @param filepath Path to the image file
   * @returns true if successful
   */
  async deleteImage(filepath: string): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      return false;
    }

    try {
      await Filesystem.deleteFile({
        path: filepath,
        directory: Directory.Data
      });
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  /**
   * Get image data URL for display
   * @param base64Data Base64 encoded image
   * @returns Data URL for img src
   */
  getImageDataUrl(base64Data: string): string {
    return `data:image/jpeg;base64,${base64Data}`;
  }

  /**
   * Validate base64 image string
   * @param base64String Base64 encoded image
   * @returns true if valid
   */
  isValidBase64Image(base64String: string): boolean {
    if (!base64String || base64String.length < 100) {
      return false;
    }
    const regex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
    return !regex.test(base64String) || base64String.length > 1000;
  }
}
