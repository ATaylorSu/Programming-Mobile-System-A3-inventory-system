/**
 * Geolocation Service - Ionic Native Integration
 * Student: BoLi
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part1 Phase 3c
 * Description: Geolocation integration for inventory tracking
 * 
 * Features:
 * - Get current location
 * - Location permission handling
 * - Address reverse geocoding
 * - Distance calculations
 */

import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService3c {
  private readonly DEFAULT_TIMEOUT = 15000;
  private readonly DEFAULT_MAX_AGE = 60000;

  constructor(private loadingCtrl: LoadingController) {}

  /**
   * Check if location permission is granted
   */
  async hasPermission(): Promise<boolean> {
    try {
      const permission = await Geolocation.checkPermissions();
      return permission.location === 'granted';
    } catch {
      return false;
    }
  }

  /**
   * Request location permission
   */
  async requestPermission(): Promise<boolean> {
    try {
      const result = await Geolocation.requestPermissions();
      return result.location === 'granted';
    } catch {
      return false;
    }
  }

  /**
   * Get current position
   * @param options Optional geolocation options
   * @returns Geoposition or null if failed
   */
  async getCurrentPosition(options?: any): Promise<any> {
    const hasPermission = await this.hasPermission();
    
    if (!hasPermission) {
      const granted = await this.requestPermission();
      if (!granted) {
        console.error('Location permission denied');
        return null;
      }
    }

    const loading = await this.loadingCtrl.create({
      message: 'Getting location...'
    });
    await loading.present();

    const defaultOptions = {
      timeout: this.DEFAULT_TIMEOUT,
      maximumAge: this.DEFAULT_MAX_AGE,
      enableHighAccuracy: true
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
      const position = await Geolocation.getCurrentPosition(mergedOptions);
      await loading.dismiss();
      return position;
    } catch (error) {
      console.error('Error getting location:', error);
      await loading.dismiss();
      return null;
    }
  }

  /**
   * Watch position changes
   * @param callback Callback function for position updates
   * @returns Watch ID to clear the watch
   */
  watchPosition(
    callback: (position: any) => void,
    errorCallback?: (error: any) => void
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const watchId = await Geolocation.watchPosition(
          {
            timeout: this.DEFAULT_TIMEOUT,
            maximumAge: this.DEFAULT_MAX_AGE,
            enableHighAccuracy: true
          },
          (position, err) => {
            if (err) {
              errorCallback?.(err);
              reject(err);
            } else if (position) {
              callback(position);
            }
          }
        );
        resolve(String(watchId));
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Clear position watch
   * @param watchId Watch ID to clear
   */
  async clearWatch(watchId: string): Promise<void> {
    await Geolocation.clearWatch({ id: watchId });
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   * @param lat1 Latitude of point 1
   * @param lon1 Longitude of point 1
   * @param lat2 Latitude of point 2
   * @param lon2 Longitude of point 2
   * @returns Distance in kilometers
   */
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Convert degrees to radians
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Format coordinates for display
   * @param lat Latitude
   * @param lon Longitude
   * @returns Formatted string
   */
  formatCoordinates(lat: number, lon: number): string {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lonDir = lon >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(6)}° ${latDir}, ${Math.abs(lon).toFixed(6)}° ${lonDir}`;
  }

  /**
   * Format distance for display
   * @param distanceKm Distance in kilometers
   * @returns Formatted string
   */
  formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)} m`;
    }
    return `${distanceKm.toFixed(2)} km`;
  }
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  formattedAddress?: string;
}
