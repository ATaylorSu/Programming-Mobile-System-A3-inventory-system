/**
 * Tab 3 - Manage Page Component
 * Allows updating and deleting existing items using item name
 *
 * Author: Haozhe Song
 * Student ID: 24832672
 * Course: PROG2005 Programming Mobile Systems
 */

import { Component } from '@angular/core';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from '../services/inventory.service';
import {
  InventoryItem,
  UpdateInventoryItemDTO,
  Category,
  StockStatus,
  CATEGORY_OPTIONS,
  STOCK_STATUS_OPTIONS
} from '../models/inventory.model';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  // Mode: 'update' or 'delete'
  activeMode: 'update' | 'delete' = 'update';

  // Forms
  searchForm: FormGroup;
  updateForm: FormGroup;
  deleteForm: FormGroup;

  // Data
  foundItem: InventoryItem | null = null;
  isSearching: boolean = false;
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
    // Search form (snake_case)
    this.searchForm = this.fb.group({
      item_name: ['', [Validators.required, Validators.minLength(1)]]
    });

    // Update form (snake_case)
    this.updateForm = this.fb.group({
      item_name: ['', Validators.minLength(1)],
      category: [''],
      quantity: [null],
      price: [null],
      supplier_name: ['', Validators.minLength(1)],
      stock_status: [''],
      featured_item: [null],
      special_note: ['']
    });

    // Delete form (snake_case)
    this.deleteForm = this.fb.group({
      item_name: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  /**
   * Reset forms when page becomes active (called every time page is entered)
   */
  ionViewDidEnter(): void {
    this.resetForms();
  }

  /**
   * Switch between update and delete modes
   */
  setMode(mode: any): void {
    if (mode === 'update' || mode === 'delete') {
      this.activeMode = mode;
    }
    this.foundItem = null;
    this.searchForm.reset();
    this.updateForm.reset();
    this.deleteForm.reset();
  }

  /**
   * Search for an item by name
   */
  async searchItem(): Promise<void> {
    const searchName = this.searchForm.get('item_name')?.value?.trim();

    if (!searchName) {
      this.showAlert('Validation Error', 'Please enter an item name to search.');
      return;
    }

    this.isSearching = true;
    this.foundItem = null;

    const loader = await this.loadingCtrl.create({
      message: 'Searching...',
      spinner: 'crescent'
    });
    await loader.present();

    this.inventoryService.getItemByName(searchName).subscribe({
      next: async (result) => {
        await loader.dismiss();
        this.isSearching = false;

        if (result.success && result.data) {
          this.foundItem = result.data;

          // Populate update form
          this.updateForm.patchValue({
            item_name: result.data.item_name,
            category: result.data.category,
            quantity: result.data.quantity,
            price: result.data.price,
            supplier_name: result.data.supplier_name,
            stock_status: result.data.stock_status,
            featured_item: result.data.featured_item === 1,
            special_note: result.data.special_note || ''
          });

          // Populate delete form
          this.deleteForm.patchValue({
            item_name: result.data.item_name
          });
        } else {
          this.showAlert('Not Found', `No item found with name "${searchName}"`);
        }
      },
      error: async () => {
        await loader.dismiss();
        this.isSearching = false;
        this.showAlert('Error', 'Unable to search. Please try again.');
      }
    });
  }

  /**
   * Update the found item
   */
  async updateItem(): Promise<void> {
    if (!this.foundItem) {
      this.showAlert('Error', 'Please search for an item first.');
      return;
    }

    // Build update data (snake_case for API)
    const updateData: UpdateInventoryItemDTO = {};
    const formValue = this.updateForm.value;

    if (formValue.item_name && formValue.item_name !== this.foundItem.item_name) {
      updateData.item_name = formValue.item_name.trim();
    }
    if (formValue.category) {
      updateData.category = formValue.category;
    }
    if (formValue.quantity !== null && formValue.quantity !== undefined) {
      updateData.quantity = Number(formValue.quantity);
    }
    if (formValue.price !== null && formValue.price !== undefined) {
      updateData.price = Number(formValue.price);
    }
    if (formValue.supplier_name) {
      updateData.supplier_name = formValue.supplier_name.trim();
    }
    if (formValue.stock_status) {
      updateData.stock_status = formValue.stock_status;
    }
    if (formValue.featured_item !== null && formValue.featured_item !== undefined) {
      updateData.featured_item = formValue.featured_item ? 1 : 0;
    }
    if (formValue.special_note !== undefined) {
      updateData.special_note = formValue.special_note?.trim() || '';
    }

    // Check if there are updates
    if (Object.keys(updateData).length === 0) {
      this.showAlert('No Changes', 'Please modify at least one field.');
      return;
    }

    this.isSubmitting = true;

    this.inventoryService.updateItem(this.foundItem.item_name, updateData).subscribe({
      next: async (result) => {
        this.isSubmitting = false;
        if (result.success) {
          await this.showToast('Item updated successfully!', 'success');
          this.resetForms();
        } else {
          this.showAlert('Error', result.error || 'Failed to update item.');
        }
      },
      error: () => {
        this.isSubmitting = false;
        this.showAlert('Error', 'Failed to update item. Please try again.');
      }
    });
  }

  /**
   * Delete the found item (with confirmation)
   */
  async deleteItem(): Promise<void> {
    const deleteName = this.deleteForm.get('item_name')?.value?.trim();

    if (!deleteName) {
      this.showAlert('Validation Error', 'Please search for an item first.');
      return;
    }

    // Confirm deletion
    const confirm = await this.alertCtrl.create({
      header: 'Confirm Deletion',
      message: `Are you sure you want to delete "${deleteName}"? This action cannot be undone.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            await this.performDelete(deleteName);
          }
        }
      ],
      cssClass: 'custom-alert'
    });
    await confirm.present();
  }

  /**
   * Perform the actual deletion
   */
  private async performDelete(name: string): Promise<void> {
    this.isSubmitting = true;

    const loader = await this.loadingCtrl.create({
      message: 'Deleting...',
      spinner: 'crescent'
    });
    await loader.present();

    this.inventoryService.deleteItem(name).subscribe({
      next: async (result) => {
        await loader.dismiss();
        this.isSubmitting = false;

        if (result.success) {
          await this.showToast('Item deleted successfully!', 'success');
          this.resetForms();
        } else {
          this.showAlert('Error', result.error || 'Failed to delete item.');
        }
      },
      error: async () => {
        await loader.dismiss();
        this.isSubmitting = false;
        this.showAlert('Error', 'Failed to delete item. Please try again.');
      }
    });
  }

  /**
   * Reset all forms and clear found item
   */
  resetForms(): void {
    this.foundItem = null;
    this.searchForm.reset();
    this.updateForm.reset();
    this.deleteForm.reset();
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
      header: 'Help - Manage Page',
      message: `
        <p><strong>Manage Items</strong></p>
        <ul style="text-align: left;">
          <li><strong>Update Mode:</strong> Search for an item, modify fields, and save changes.</li>
          <li><strong>Delete Mode:</strong> Search for an item and delete it (with confirmation).</li>
          <li><strong>Leave blank:</strong> Fields left blank in update form will keep their current values.</li>
          <li><strong>Featured:</strong> Toggle the checkbox to mark/unmark as featured.</li>
        </ul>
        <p><strong>Note:</strong> Item names must remain unique.</p>
      `,
      buttons: ['Got it!'],
      cssClass: 'custom-alert'
    });
    await alert.present();
  }
}
