/**
 * Tab 1 - List Page Component
 * Displays all inventory items and allows searching by name
 *
 * Author: Haozhe Song
 * Student ID: 24832672
 * Course: PROG2005 Programming Mobile Systems
 */

import { Component } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { InventoryService } from '../services/inventory.service';
import { InventoryItem } from '../models/inventory.model';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  // Data
  items: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  searchTerm: string = '';

  // Loading state
  isLoading: boolean = true;
  isSearching: boolean = false;

  // Error state
  errorMessage: string = '';

  constructor(
    private inventoryService: InventoryService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  /**
   * Load items when page becomes active (called every time page is entered)
   */
  ionViewDidEnter(): void {
    this.loadItems();
  }

  /**
   * Load all items from the API
   */
  async loadItems(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    const loader = await this.loadingCtrl.create({
      message: 'Loading inventory...',
      spinner: 'crescent',
      cssClass: 'custom-loading'
    });
    await loader.present();

    this.inventoryService.getAllItems().subscribe({
      next: (result) => {
        loader.dismiss();
        this.isLoading = false;
        if (result.success && result.data) {
          this.items = result.data;
          this.applyFilter();
        } else {
          this.errorMessage = result.error || 'Failed to load items';
        }
      },
      error: (err) => {
        loader.dismiss();
        this.isLoading = false;
        this.errorMessage = 'Unable to connect to server. Please check your connection.';
        console.error('Error loading items:', err);
      }
    });
  }

  /**
   * Search for an item by name
   */
  async searchItem(): Promise<void> {
    if (!this.searchTerm.trim()) {
      this.applyFilter();
      return;
    }

    this.isSearching = true;
    const encodedName = encodeURIComponent(this.searchTerm.trim());

    this.inventoryService.getItemByName(encodedName).subscribe({
      next: (result) => {
        this.isSearching = false;
        if (result.success && result.data) {
          this.filteredItems = [result.data];
        } else {
          this.showAlert('Not Found', `No item found with name "${this.searchTerm}"`);
          this.applyFilter();
        }
      },
      error: (err) => {
        this.isSearching = false;
        this.showAlert('Search Error', 'Unable to search for this item. Please try again.');
        console.error('Search error:', err);
      }
    });
  }

  /**
   * Clear search and show all items
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilter();
  }

  /**
   * Apply filter based on search term
   */
  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredItems = [...this.items];
    }
  }

  /**
   * Refresh the list
   */
  doRefresh(event: CustomEvent): void {
    this.inventoryService.getAllItems().subscribe({
      next: (result) => {
        if (result.success && result.data) {
          this.items = result.data;
          this.applyFilter();
        }
        (event.target as HTMLIonRefresherElement).complete();
      },
      error: () => {
        (event.target as HTMLIonRefresherElement).complete();
      }
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
   * Show help information
   */
  async showHelp(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Help - List Page',
      message: `
        <p><strong>List Page</strong> displays all inventory items.</p>
        <p><strong>Search:</strong> Enter an item name to find a specific item.</p>
        <p><strong>Pull to Refresh:</strong> Swipe down to reload the list.</p>
        <p><strong>Featured Items:</strong> Items marked with a star are featured items.</p>
      `,
      buttons: ['Got it!'],
      cssClass: 'custom-alert'
    });
    await alert.present();
  }
}
