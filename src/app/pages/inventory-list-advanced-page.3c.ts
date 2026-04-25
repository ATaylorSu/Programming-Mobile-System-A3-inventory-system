/**
 * Advanced Inventory List Page - Enhanced with Native Features
 * Student: BoLi
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part1 Phase 3c
 * Description: Enhanced inventory list with offline support and image capture
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { StorageService3c } from '../services/storage.service.3c';
import { CameraService3c } from '../services/camera.service.3c';
import { ImageCaptureComponent } from '../components/image-capture.component.3c';
import { OfflineBannerComponent } from '../components/offline-banner.component.3c';
import { LoadingSkeletonComponent } from '../components/loading-skeleton.component.3c';
import { InventoryItem, Category, StockStatus } from '../models/inventory.model';

@Component({
  selector: 'app-inventory-list-advanced',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Inventory</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="showHelp()">
            <ion-icon name="help-circle-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar 
          [(ngModel)]="searchTerm" 
          (ionInput)="onSearch()"
          placeholder="Search items...">
        </ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <app-offline-banner></app-offline-banner>
      
      <div *ngIf="loading">
        <app-loading-skeleton [count]="5"></app-loading-skeleton>
      </div>

      <ion-list *ngIf="!loading && items.length > 0">
        <ion-item-sliding *ngFor="let item of filteredItems">
          <ion-item>
            <ion-icon name="cube-outline" slot="start"></ion-icon>
            <ion-label>
              <h2>{{ item.itemName }}</h2>
              <p>{{ item.category }}</p>
              <p>{{ item.price | currency }}</p>
            </ion-label>
            <ion-badge 
              [color]="getStockColor(item.stockStatus)" 
              slot="end">
              {{ item.stockStatus }}
            </ion-badge>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="primary" (click)="editItem(item)">
              <ion-icon name="create-outline"></ion-icon>
            </ion-item-option>
            <ion-item-option color="danger" (click)="deleteItem(item)">
              <ion-icon name="trash-outline"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <div class="empty-state" *ngIf="!loading && items.length === 0">
        <ion-icon name="cube-outline" class="empty-icon"></ion-icon>
        <p>No inventory items found</p>
        <ion-button (click)="addNewItem()">Add First Item</ion-button>
      </div>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button (click)="addNewItem()">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styles: [`
    ion-thumbnail {
      width: 56px;
      height: 56px;
    }
    
    ion-thumbnail img {
      object-fit: cover;
    }
    
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
    }
    
    .empty-icon {
      font-size: 80px;
      color: #ccc;
      margin-bottom: 16px;
    }
    
    ion-fab {
      margin: 16px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule, 
    IonicModule, 
    FormsModule,
    ImageCaptureComponent,
    OfflineBannerComponent,
    LoadingSkeletonComponent
  ]
})
export class InventoryListAdvancedPage implements OnInit {
  items: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  searchTerm = '';
  loading = true;
  isOnline = true;

  constructor(
    private storageService: StorageService3c,
    private cameraService: CameraService3c
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadItems();
  }

  async loadItems(): Promise<void> {
    this.loading = true;
    
    const cachedItems = await this.storageService.getCachedInventoryItems<InventoryItem>();
    
    if (cachedItems) {
      this.items = cachedItems;
      this.filteredItems = [...this.items];
    }
    
    this.loading = false;
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredItems = [...this.items];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredItems = this.items.filter(item => 
      item.itemName.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term)
    );
  }

  getStockColor(status: string): string {
    switch (status) {
      case 'In Stock': return 'success';
      case 'Low Stock': return 'warning';
      case 'Out of Stock': return 'danger';
      default: return 'medium';
    }
  }

  editItem(item: InventoryItem): void {
    console.log('Edit item:', item);
  }

  async deleteItem(item: InventoryItem): Promise<void> {
    console.log('Delete item:', item);
  }

  addNewItem(): void {
    console.log('Add new item');
  }

  showHelp(): void {
    console.log('Inventory List Help: Search, view, and manage your inventory items.');
  }
}
