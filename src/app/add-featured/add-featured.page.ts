/**
 * Add Featured Page Component
 * Student: JiemingLiu
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part1 - Phase 3b (UI Page Components)
 * Description: Page for adding new inventory items and displaying featured items
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
         IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
         IonCardContent, IonList, IonItem, IonLabel, IonInput, IonTextarea,
         IonSelect, IonSelectOption, IonBadge, IonSegment, IonSegmentButton,
         IonNote, IonSpinner, AlertController, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { Subject, takeUntil } from 'rxjs';
import { InventoryService } from '../services/inventory.service';
import { InventoryItem, Category, StockStatus, CreateInventoryItem } from '../models/inventory.model';

@Component({
  selector: 'app-add-featured',
  templateUrl: './add-featured.page.html',
  styleUrls: ['./add-featured.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
    IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonCardContent, IonList, IonItem, IonLabel, IonInput, IonTextarea,
    IonSelect, IonSelectOption, IonBadge, IonSegment, IonSegmentButton,
    IonNote, IonSpinner, IonGrid, IonRow, IonCol
  ]
})
export class AddFeaturedPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  selectedSegment: 'add' | 'featured' = 'add';
  featuredItems: InventoryItem[] = [];
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  showSuccess: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  // Form fields
  itemName: string = '';
  category: string = '';
  quantity: number | null = null;
  price: number | null = null;
  supplierName: string = '';
  stockStatus: string = StockStatus.IN_STOCK;
  featuredItem: number = 0;
  specialNote: string = '';

  categories = Object.values(Category);
  stockStatuses = Object.values(StockStatus);

  constructor(
    private inventoryService: InventoryService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit(): void {
    this.loadFeaturedItems();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadFeaturedItems(): void {
    this.isLoading = true;
    this.inventoryService.getFeaturedItems().subscribe({
      next: (items) => {
        this.featuredItems = items;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to load featured items';
        this.isLoading = false;
      }
    });
  }

  onSegmentChange(event: CustomEvent): void {
    this.selectedSegment = event.detail.value;
    if (this.selectedSegment === 'featured') {
      this.loadFeaturedItems();
    }
  }

  async submitForm(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const newItem: CreateInventoryItem = {
      itemName: this.itemName.trim(),
      category: this.category,
      quantity: this.quantity!,
      price: this.price!,
      supplierName: this.supplierName.trim(),
      stockStatus: this.stockStatus,
      featuredItem: this.featuredItem,
      specialNote: this.specialNote.trim()
    };

    this.inventoryService.createItem(newItem).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.showSuccessMessage(response.message || 'Item created successfully');
        this.resetForm();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Failed to create item';
      }
    });
  }

  validateForm(): boolean {
    if (!this.itemName || this.itemName.trim() === '') {
      this.errorMessage = 'Item name is required';
      return false;
    }

    if (!this.category) {
      this.errorMessage = 'Category is required';
      return false;
    }

    if (this.quantity === null || this.quantity === undefined) {
      this.errorMessage = 'Quantity is required';
      return false;
    }

    if (this.quantity < 0 || !Number.isInteger(this.quantity)) {
      this.errorMessage = 'Quantity must be a non-negative integer';
      return false;
    }

    if (this.price === null || this.price === undefined) {
      this.errorMessage = 'Price is required';
      return false;
    }

    if (this.price < 0) {
      this.errorMessage = 'Price must be a non-negative number';
      return false;
    }

    if (!this.supplierName || this.supplierName.trim() === '') {
      this.errorMessage = 'Supplier name is required';
      return false;
    }

    this.errorMessage = '';
    return true;
  }

  resetForm(): void {
    this.itemName = '';
    this.category = '';
    this.quantity = null;
    this.price = null;
    this.supplierName = '';
    this.stockStatus = StockStatus.IN_STOCK;
    this.featuredItem = 0;
    this.specialNote = '';
  }

  private showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.showSuccess = true;
    setTimeout(() => {
      this.showSuccess = false;
    }, 3000);
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  getStockStatusColor(status: StockStatus): string {
    switch (status) {
      case StockStatus.IN_STOCK:
        return 'success';
      case StockStatus.LOW_STOCK:
        return 'warning';
      case StockStatus.OUT_OF_STOCK:
        return 'danger';
      default:
        return 'medium';
    }
  }

  async showHelp(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Help - Add/Featured Items',
      message: `
        <p><strong>Add New Item:</strong></p>
        <ul>
          <li>Fill in all required fields marked with *</li>
          <li>Item Name: Unique name for the inventory item</li>
          <li>Category: Select from Electronics, Furniture, Clothing, Tools, or Miscellaneous</li>
          <li>Quantity: Enter a non-negative integer</li>
          <li>Price: Enter the item price (non-negative)</li>
          <li>Featured Item: Set to 1 or higher to feature the item</li>
        </ul>
        <p><strong>Featured Items:</strong></p>
        <ul>
          <li>Items with Featured Item value > 0 are shown here</li>
        </ul>
      `,
      buttons: ['Got it']
    });
    await alert.present();
  }
}
