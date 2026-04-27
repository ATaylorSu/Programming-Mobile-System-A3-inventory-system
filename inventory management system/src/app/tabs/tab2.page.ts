/**
 * Tab 2 - Add Page Component
 * Allows adding new inventory items and displays featured items
 *
 * Author: Haozhe Song
 * Student ID: 24832672
 * Course: PROG2005 Programming Mobile Systems
 */

import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from '../services/inventory.service';
import {
  InventoryItem,
  CreateInventoryItemDTO,
  Category,
  StockStatus,
  CATEGORY_OPTIONS,
  STOCK_STATUS_OPTIONS
} from '../models/inventory.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  // Form
  addItemForm: FormGroup;

  // Data
  allItems: InventoryItem[] = [];
  featuredItems: InventoryItem[] = [];

  // Loading state
  isLoading: boolean = true;
  isSubmitting: boolean = false;

  // Options
  categoryOptions = CATEGORY_OPTIONS;
  stockStatusOptions = STOCK_STATUS_OPTIONS;

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    // Initialize form with validators (snake_case for API)
    this.addItemForm = this.fb.group({
      item_name: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100)
      ]],
      category: [Category.Electronics, Validators.required],
      quantity: [0, [
        Validators.required,
        Validators.min(0),
        Validators.pattern(/^\d+$/)
      ]],
      price: [0, [
        Validators.required,
        Validators.min(0)
      ]],
      supplier_name: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100)
      ]],
      stock_status: [StockStatus.InStock, Validators.required],
      featured_item: [0],
      special_note: ['']
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Load data when page becomes active (called every time page is entered)
   */
  ionViewDidEnter(): void {
    this.loadData();
  }

  /**
   * Load all items to display featured items
   */
  async loadData(): Promise<void> {
    this.isLoading = true;

    const loader = await this.loadingCtrl.create({
      message: 'Loading...',
      spinner: 'crescent'
    });
    await loader.present();

    this.inventoryService.getAllItems().subscribe({
      next: (result) => {
        loader.dismiss();
        this.isLoading = false;
        if (result.success && result.data) {
          this.allItems = result.data;
          this.featuredItems = result.data.filter(item => item.featured_item === 1);
        }
      },
      error: () => {
        loader.dismiss();
        this.isLoading = false;
      }
    });
  }

  /**
   * Submit the add item form
   */
  async onSubmit(): Promise<void> {
    if (!this.addItemForm.valid) {
      this.showAlert('Validation Error', 'Please fill in all required fields correctly.');
      return;
    }

    this.isSubmitting = true;

    const formValue = this.addItemForm.value;

    // Check if item name already exists
    const nameExists = this.allItems.some(
      item => item.item_name.toLowerCase() === formValue.item_name.toLowerCase()
    );

    if (nameExists) {
      this.isSubmitting = false;
      this.showAlert('Duplicate Error', 'An item with this name already exists.');
      return;
    }

    // Create DTO (snake_case for API)
    const newItem: CreateInventoryItemDTO = {
      item_name: formValue.item_name.trim(),
      category: formValue.category,
      quantity: Number(formValue.quantity),
      price: Number(formValue.price),
      supplier_name: formValue.supplier_name.trim(),
      stock_status: formValue.stock_status,
      featured_item: formValue.featured_item ? 1 : 0,
      special_note: formValue.special_note?.trim() || undefined
    };

    this.inventoryService.createItem(newItem).subscribe({
      next: async (result) => {
        this.isSubmitting = false;
        if (result.success) {
          this.addItemForm.reset({
            category: Category.Electronics,
            stock_status: StockStatus.InStock,
            featured_item: 0
          });
          await this.showToast('Item added successfully!', 'success');
          await this.loadData(); // Refresh featured items
        } else {
          this.showAlert('Error', result.error || 'Failed to add item.');
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.showAlert('Error', 'Failed to add item. Please try again.');
        console.error('Error adding item:', err);
      }
    });
  }

  /**
   * Reset the form
   */
  resetForm(): void {
    this.addItemForm.reset({
      category: Category.Electronics,
      stock_status: StockStatus.InStock,
      featured_item: 0
    });
  }

  /**
   * Get badge class based on category
   */
  getCategoryBadgeClass(category: string): string {
    return `badge-${category.toLowerCase()}`;
  }

  /**
   * Get badge class based on stock status
   */
  getStatusBadgeClass(status: string): string {
    const statusMap: Record<string, string> = {
      'In stock': 'badge-in-stock',
      'Low stock': 'badge-low-stock',
      'Out of stock': 'badge-out-of-stock'
    };
    return statusMap[status] || '';
  }

  /**
   * Format price as currency
   */
  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  /**
   * Show alert message
   */
  async showAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
      cssClass: 'custom-alert'
    });
    await alert.present();
  }

  /**
   * Show toast message
   */
  async showToast(message: string, type: 'success' | 'error' = 'success'): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'top',
      color: type === 'success' ? 'success' : 'danger',
      buttons: [
        {
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  /**
   * Show help information
   */
  async showHelp(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Help - Add Page',
      message: `
        <p><strong>Add New Item</strong></p>
        <ul style="text-align: left;">
          <li><strong>Item Name:</strong> Unique name (required)</li>
          <li><strong>Category:</strong> Electronics, Furniture, Clothing, Tools, Miscellaneous</li>
          <li><strong>Quantity:</strong> Number of items in stock</li>
          <li><strong>Price:</strong> Price in dollars</li>
          <li><strong>Supplier:</strong> Supplier name (required)</li>
          <li><strong>Stock Status:</strong> In stock, Low stock, Out of stock</li>
          <li><strong>Featured:</strong> Check to mark as featured</li>
          <li><strong>Special Note:</strong> Optional notes</li>
        </ul>
        <p><strong>Featured Items:</strong> Shows items marked as featured (scroll down).</p>
      `,
      buttons: ['Got it!'],
      cssClass: 'custom-alert'
    });
    await alert.present();
  }

  /**
   * Refresh featured items
   */
  doRefresh(event: CustomEvent): void {
    this.inventoryService.getAllItems().subscribe({
      next: (result) => {
        if (result.success && result.data) {
          this.allItems = result.data;
          this.featuredItems = result.data.filter(item => item.featured_item === 1);
        }
        (event.target as HTMLIonRefresherElement).complete();
      },
      error: () => {
        (event.target as HTMLIonRefresherElement).complete();
      }
    });
  }
}
