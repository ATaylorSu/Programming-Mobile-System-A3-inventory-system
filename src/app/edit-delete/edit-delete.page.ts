/**
 * Edit Delete Page Component
 * Student: JiemingLiu
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part1 - Phase 3b (UI Page Components)
 * Description: Page for updating and deleting existing inventory items
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
         IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
         IonCardContent, IonList, IonItem, IonLabel, IonInput, IonTextarea,
         IonSelect, IonSelectOption, IonBadge, IonSegment, IonSegmentButton,
         IonNote, IonSpinner, IonSearchbar, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { InventoryService } from '../services/inventory.service';
import { InventoryItem, Category, StockStatus, UpdateInventoryItem } from '../models/inventory.model';

@Component({
  selector: 'app-edit-delete',
  templateUrl: './edit-delete.page.html',
  styleUrls: ['./edit-delete.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
    IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonCardContent, IonList, IonItem, IonLabel, IonInput, IonTextarea,
    IonSelect, IonSelectOption, IonBadge, IonSegment, IonSegmentButton,
    IonNote, IonSpinner, IonSearchbar, IonGrid, IonRow, IonCol
  ]
})
export class EditDeletePage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  selectedSegment: 'search' | 'edit' | 'delete' = 'search';
  inventoryItems: InventoryItem[] = [];
  searchQuery: string = '';
  selectedItem: InventoryItem | null = null;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  showSuccess: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  searchResults: InventoryItem[] = [];

  // Edit form fields
  editCategory: Category | '' = '';
  editQuantity: number | null = null;
  editPrice: number | null = null;
  editSupplierName: string = '';
  editStockStatus: string = '';
  editFeaturedItem: number = 0;
  editSpecialNote: string = '';

  categories = Object.values(Category);
  stockStatuses = Object.values(StockStatus);

  constructor(
    private inventoryService: InventoryService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadInventory(): void {
    this.isLoading = true;
    this.inventoryService.getAllItems().subscribe({
      next: (items) => {
        this.inventoryItems = items;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to load inventory';
        this.isLoading = false;
      }
    });
  }

  onSegmentChange(event: CustomEvent): void {
    this.selectedSegment = event.detail.value;
    this.showSuccess = false;
    this.errorMessage = '';
    if (this.selectedSegment === 'search') {
      this.loadInventory();
    }
  }

  onSearchChange(event: CustomEvent): void {
    this.searchQuery = event.detail.value || '';
    this.performSearch();
  }

  performSearch(): void {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      this.searchResults = [];
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.searchResults = this.inventoryItems.filter(item =>
      item.itemName.toLowerCase().includes(query)
    );
  }

  selectItemForEdit(item: InventoryItem): void {
    this.selectedItem = item;
    this.editCategory = item.category;
    this.editQuantity = item.quantity;
    this.editPrice = item.price;
    this.editSupplierName = item.supplierName;
    this.editStockStatus = item.stockStatus;
    this.editFeaturedItem = item.featuredItem;
    this.editSpecialNote = item.specialNote || '';
    this.selectedSegment = 'edit';
  }

  async submitUpdate(): Promise<void> {
    if (!this.selectedItem || !this.validateEditForm()) {
      return;
    }

    const confirmed = await this.showConfirmDialog(
      'Update Item',
      `Are you sure you want to update "${this.selectedItem.itemName}"?`
    );

    if (!confirmed) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const updates: UpdateInventoryItem = {
      category: this.editCategory,
      quantity: this.editQuantity!,
      price: this.editPrice!,
      supplierName: this.editSupplierName,
      stockStatus: this.editStockStatus,
      featuredItem: this.editFeaturedItem,
      specialNote: this.editSpecialNote
    };

    this.inventoryService.updateItem(this.selectedItem.itemName, updates).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.showSuccessMessage(response.message || 'Item updated successfully');
        this.resetEditForm();
        this.loadInventory();
        this.selectedSegment = 'search';
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Failed to update item';
      }
    });
  }

  validateEditForm(): boolean {
    if (!this.selectedItem) {
      this.errorMessage = 'No item selected';
      return false;
    }

    if (!this.editCategory) {
      this.errorMessage = 'Category is required';
      return false;
    }

    if (this.editQuantity === null || this.editQuantity === undefined) {
      this.errorMessage = 'Quantity is required';
      return false;
    }

    if (this.editQuantity < 0 || !Number.isInteger(this.editQuantity)) {
      this.errorMessage = 'Quantity must be a non-negative integer';
      return false;
    }

    if (this.editPrice === null || this.editPrice === undefined) {
      this.errorMessage = 'Price is required';
      return false;
    }

    if (this.editPrice < 0) {
      this.errorMessage = 'Price must be a non-negative number';
      return false;
    }

    if (!this.editSupplierName || this.editSupplierName.trim() === '') {
      this.errorMessage = 'Supplier name is required';
      return false;
    }

    this.errorMessage = '';
    return true;
  }

  async deleteItem(item: InventoryItem): Promise<void> {
    if (item.itemName.toLowerCase() === 'laptop') {
      await this.showAlert(
        'Delete Not Allowed',
        'The "Laptop" item cannot be deleted as it is protected by the system.'
      );
      return;
    }

    const confirmed = await this.showConfirmDialog(
      'Delete Item',
      `Are you sure you want to delete "${item.itemName}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.inventoryService.deleteItem(item.itemName).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.showSuccessMessage(response.message || 'Item deleted successfully');
        this.loadInventory();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Failed to delete item';
      }
    });
  }

  resetEditForm(): void {
    this.selectedItem = null;
    this.editCategory = '';
    this.editQuantity = null;
    this.editPrice = null;
    this.editSupplierName = '';
    this.editStockStatus = '';
    this.editFeaturedItem = 0;
    this.editSpecialNote = '';
  }

  private showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.showSuccess = true;
    setTimeout(() => {
      this.showSuccess = false;
    }, 3000);
  }

  private async showConfirmDialog(title: string, message: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertCtrl.create({
        header: title,
        message: message,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => resolve(false)
          },
          {
            text: 'Confirm',
            handler: () => resolve(true)
          }
        ]
      });
      await alert.present();
    });
  }

  private async showAlert(title: string, message: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: title,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
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

  getCategoryIcon(category: Category): string {
    switch (category) {
      case Category.ELECTRONICS:
        return 'laptop-outline';
      case Category.FURNITURE:
        return 'bed-outline';
      case Category.CLOTHING:
        return 'shirt-outline';
      case Category.TOOLS:
        return 'construct-outline';
      case Category.MISCELLANEOUS:
        return 'cube-outline';
      default:
        return 'ellipse-outline';
    }
  }

  isProtectedItem(item: InventoryItem): boolean {
    return item.itemName.toLowerCase() === 'laptop';
  }

  async showHelp(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Help - Edit/Delete Items',
      message: `
        <p><strong>Search for Items:</strong></p>
        <ul>
          <li>Enter an item name in the search bar to find specific items</li>
          <li>Click on an item to select it for editing</li>
        </ul>
        <p><strong>Edit Items:</strong></p>
        <ul>
          <li>Select an item from search results</li>
          <li>Modify the fields you want to update</li>
          <li>Click "Update Item" to save changes</li>
        </ul>
        <p><strong>Delete Items:</strong></p>
        <ul>
          <li>Navigate to the Delete tab</li>
          <li>Find the item you want to delete</li>
          <li>Click the delete button and confirm</li>
          <li>Note: The "Laptop" item is protected and cannot be deleted</li>
        </ul>
      `,
      buttons: ['Got it']
    });
    await alert.present();
  }
}
