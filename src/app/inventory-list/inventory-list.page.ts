/**
 * Inventory List Page Component
 * Student: JiemingLiu
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part1 - Phase 3b (UI Page Components)
 * Description: Page for displaying all inventory items with search functionality
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
         IonList, IonItem, IonLabel, IonBadge, IonRefresher, IonRefresherContent, RefresherEventDetail,
         IonNote, IonIcon, IonButtons, IonButton, IonCard, IonCardHeader,
         IonCardTitle, IonCardSubtitle, IonCardContent, IonSelect, IonSelectOption,
         IonGrid, IonRow, IonCol, IonSpinner } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { InventoryService } from '../services/inventory.service';
import { InventoryItem, Category, StockStatus } from '../models/inventory.model';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.page.html',
  styleUrls: ['./inventory-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonSearchbar, IonList, IonItem, IonLabel, IonBadge,
    IonRefresher, IonRefresherContent, IonNote, IonIcon, IonButtons, IonButton,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonSelect, IonSelectOption, IonGrid, IonRow, IonCol, IonSpinner
  ]
})
export class InventoryListPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  inventoryItems: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  searchQuery: string = '';
  selectedCategory: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  showError: boolean = false;

  categories = Object.values(Category);
  stockStatuses = Object.values(StockStatus);

  constructor(private inventoryService: InventoryService, private alertCtrl: AlertController) {}

  ngOnInit(): void {
    this.loadInventory();
    this.setupSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSubscriptions(): void {
    this.inventoryService.inventory$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.inventoryItems = items;
        this.applyFilters();
      });

    this.inventoryService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
      });
  }

  loadInventory(): void {
    this.inventoryService.getAllItems().subscribe({
      next: (items) => {
        this.inventoryItems = items;
        this.applyFilters();
        this.hideError();
      },
      error: (error) => {
        this.showErrorMessage(error.message || 'Failed to load inventory');
      }
    });
  }

  applyFilters(): void {
    let result = [...this.inventoryItems];

    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const query = this.searchQuery.toLowerCase().trim();
      result = result.filter(item =>
        item.itemName.toLowerCase().includes(query) ||
        (item.specialNote && item.specialNote.toLowerCase().includes(query))
      );
    }

    if (this.selectedCategory && this.selectedCategory !== '') {
      result = result.filter(item => item.category === this.selectedCategory);
    }

    this.filteredItems = result;
  }

  onSearchChange(event: CustomEvent): void {
    this.searchQuery = event.detail.value || '';
    this.applyFilters();
  }

  onCategoryChange(event: CustomEvent): void {
    this.selectedCategory = event.detail.value || '';
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.applyFilters();
  }

  refreshInventory(event: CustomEvent<RefresherEventDetail>): void {
    this.inventoryService.refreshInventory();
    setTimeout(() => {
      event.detail.complete();
    }, 1000);
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

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  private showErrorMessage(message: string): void {
    this.errorMessage = message;
    this.showError = true;
  }

  private hideError(): void {
    this.showError = false;
    this.errorMessage = '';
  }

  async showHelp(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Help - Inventory List',
      message: `
        <p><strong>Search:</strong> Enter an item name or special note to filter results.</p>
        <p><strong>Category Filter:</strong> Select a category to filter items.</p>
        <p><strong>Stock Status:</strong></p>
        <ul>
          <li>Green badge = In Stock</li>
          <li>Yellow badge = Low Stock</li>
          <li>Red badge = Out of Stock</li>
        </ul>
        <p><strong>Featured Items:</strong> Items marked as featured appear with a star icon.</p>
      `,
      buttons: ['Got it']
    });
    await alert.present();
  }
}
