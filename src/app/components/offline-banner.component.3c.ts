/**
 * Offline Banner Component
 * Student: BoLi
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part1 Phase 3c
 * Description: Network status indicator for offline/online mode
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-offline-banner',
  template: `
    <ion-item *ngIf="!isOnline" class="offline-banner" color="warning">
      <ion-icon name="cloud-offline-outline"></ion-icon>
      <ion-label>
        You are currently offline. Some features may be limited.
      </ion-label>
      <ion-button fill="clear" size="small" (click)="checkConnection()">
        <ion-icon name="refresh-outline"></ion-icon>
      </ion-button>
    </ion-item>
  `,
  styles: [`
    .offline-banner {
      padding: 8px 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .offline-banner ion-icon {
      font-size: 24px;
    }
    
    .offline-banner ion-label {
      flex: 1;
    }
  `],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class OfflineBannerComponent implements OnInit, OnDestroy {
  isOnline = true;
  private checkInterval: any;

  async ngOnInit(): Promise<void> {
    await this.checkConnection();
    
    this.checkInterval = setInterval(() => {
      this.checkConnection();
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }

  async checkConnection(): Promise<void> {
    try {
      const status = await Network.getStatus();
      this.isOnline = status.connected;
    } catch {
      this.isOnline = navigator.onLine;
    }
  }
}
