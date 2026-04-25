/**
 * Inventory Service - API Integration Layer
 * Student: HaozheSong (ID: 24832672)
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part1 - Phase 3a (API Service Layer)
 * Description: Service layer for communicating with the inventory REST API
 *              at https://prog2005.it.scu.edu.au/ArtGalley
 *
 * REST API Endpoints:
 * - GET /             : Get all items
 * - GET /{name}      : Get item by name
 * - POST /            : Create new item
 * - PUT /{name}      : Update existing item
 * - DELETE /{name}   : Delete item (Laptop deletion forbidden)
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, map, retry, timeout, tap } from 'rxjs/operators';
import {
  InventoryItem,
  CreateInventoryItem,
  UpdateInventoryItem,
  ApiResponse,
  Category,
  StockStatus
} from '../models/inventory.model';
import { InventoryError, ErrorCode } from './inventory-error.handler';
import * as localProducts from '../../assets/products.json';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private readonly API_BASE_URL = 'https://prog2005.it.scu.edu.au/ArtGalley';
  private readonly TIMEOUT_MS = 10000;
  private readonly MAX_RETRIES = 3;

  private inventorySubject = new BehaviorSubject<InventoryItem[]>([]);
  public inventory$ = this.inventorySubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadLocalProducts();
  }

  private loadLocalProducts(): void {
    this.setLoading(true);
    const products = (localProducts as any).default || localProducts;
    this.inventorySubject.next(products);
    this.setLoading(false);
  }

  private getHttpHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    let errorCode = ErrorCode.UNKNOWN;

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
      errorCode = ErrorCode.NETWORK_ERROR;
    } else {
      switch (error.status) {
        case 0:
          errorMessage = 'Unable to connect to the server. Please check your internet connection.';
          errorCode = ErrorCode.NETWORK_ERROR;
          break;
        case 400:
          errorMessage = `Bad Request: ${error.error?.message || 'Invalid data provided'}`;
          errorCode = ErrorCode.VALIDATION_ERROR;
          break;
        case 404:
          errorMessage = 'The requested item was not found.';
          errorCode = ErrorCode.NOT_FOUND;
          break;
        case 409:
          errorMessage = 'An item with this name already exists.';
          errorCode = ErrorCode.CONFLICT;
          break;
        case 500:
          errorMessage = 'Server error: Please try again later.';
          errorCode = ErrorCode.SERVER_ERROR;
          break;
        default:
          errorMessage = `Server Error: ${error.status} - ${error.statusText}`;
          errorCode = ErrorCode.SERVER_ERROR;
      }
    }

    console.error('InventoryService Error:', errorMessage, error);
    const inventoryError = new InventoryError(errorMessage, errorCode, error.status);
    return throwError(() => inventoryError);
  }

  private loadInventory(): void {
    this.loadLocalProducts();
  }

  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  /**
   * Retrieve all inventory items from local data
   * GET endpoint/
   */
  getAllItems(): Observable<InventoryItem[]> {
    return of((localProducts as any).default || localProducts).pipe(
      map((items) => items as InventoryItem[])
    );
  }

  /**
   * Retrieve a single inventory item by name
   * GET endpoint/{name}
   */
  getItemByName(name: string): Observable<InventoryItem> {
    if (!name || name.trim() === '') {
      return throwError(() => new InventoryError(
        'Item name is required for search',
        ErrorCode.VALIDATION_ERROR
      ));
    }
    const encodedName = encodeURIComponent(name.trim());
    return this.http.get<InventoryItem>(`${this.API_BASE_URL}/${encodedName}`).pipe(
      timeout(this.TIMEOUT_MS),
      retry({ count: this.MAX_RETRIES, delay: 1000 }),
      catchError(this.handleError)
    );
  }

  /**
   * Create a new inventory item
   * POST endpoint/
   */
  createItem(item: CreateInventoryItem): Observable<ApiResponse<InventoryItem>> {
    this.validateCreateItem(item);
    const payload = this.prepareCreatePayload(item);

    return this.http.post<InventoryItem>(this.API_BASE_URL, payload).pipe(
      timeout(this.TIMEOUT_MS),
      retry({ count: this.MAX_RETRIES, delay: 1000 }),
      tap(() => this.refreshInventory()),
      map((createdItem) => ({
        success: true,
        message: `Item "${createdItem.itemName}" created successfully`,
        data: createdItem
      })),
      catchError(this.handleError)
    );
  }

  /**
   * Update an existing inventory item by name
   * PUT endpoint/{name}
   */
  updateItem(name: string, updates: UpdateInventoryItem): Observable<ApiResponse<InventoryItem>> {
    if (!name || name.trim() === '') {
      return throwError(() => new InventoryError(
        'Item name is required for update',
        ErrorCode.VALIDATION_ERROR
      ));
    }
    this.validateUpdateItem(updates);
    const encodedName = encodeURIComponent(name.trim());

    return this.http.put<InventoryItem>(`${this.API_BASE_URL}/${encodedName}`, updates).pipe(
      timeout(this.TIMEOUT_MS),
      retry({ count: this.MAX_RETRIES, delay: 1000 }),
      tap(() => this.refreshInventory()),
      map((updatedItem) => ({
        success: true,
        message: `Item "${name}" updated successfully`,
        data: updatedItem
      })),
      catchError(this.handleError)
    );
  }

  /**
   * Delete an inventory item by name
   * DELETE endpoint/{name}
   * Note: Deletion of "Laptop" is forbidden by the server
   */
  deleteItem(name: string): Observable<ApiResponse<null>> {
    if (!name || name.trim() === '') {
      return throwError(() => new InventoryError(
        'Item name is required for deletion',
        ErrorCode.VALIDATION_ERROR
      ));
    }

    if (name.toLowerCase() === 'laptop') {
      return throwError(() => new InventoryError(
        'Deletion of "Laptop" is not allowed. This item is protected.',
        ErrorCode.VALIDATION_ERROR
      ));
    }

    const encodedName = encodeURIComponent(name.trim());

    return this.http.delete<ApiResponse<null>>(`${this.API_BASE_URL}/${encodedName}`).pipe(
      timeout(this.TIMEOUT_MS),
      retry({ count: this.MAX_RETRIES, delay: 1000 }),
      tap(() => this.refreshInventory()),
      map((response) => ({
        success: true,
        message: `Item "${name}" deleted successfully`,
        data: null
      })),
      catchError(this.handleError)
    );
  }

  /**
   * Search inventory items by name (local filtering)
   * Uses the API to get all items, then filters locally
   */
  searchItems(query: string): Observable<InventoryItem[]> {
    return this.getAllItems().pipe(
      map((items) => {
        if (!query || query.trim() === '') {
          return items;
        }
        const lowerQuery = query.toLowerCase().trim();
        return items.filter(item =>
          item.itemName.toLowerCase().includes(lowerQuery) ||
          (item.specialNote && item.specialNote.toLowerCase().includes(lowerQuery))
        );
      })
    );
  }

  /**
   * Get featured items only
   * Filters items where featuredItem > 0
   */
  getFeaturedItems(): Observable<InventoryItem[]> {
    return this.getAllItems().pipe(
      map((items) => items.filter(item => item.featuredItem > 0))
    );
  }

  /**
   * Get items by category
   */
  getItemsByCategory(category: string): Observable<InventoryItem[]> {
    return this.getAllItems().pipe(
      map((items) => items.filter(item => item.category === category))
    );
  }

  /**
   * Get items by stock status
   */
  getItemsByStockStatus(status: StockStatus): Observable<InventoryItem[]> {
    return this.getAllItems().pipe(
      map((items) => items.filter(item => item.stockStatus === status))
    );
  }

  /**
   * Validate create item data
   */
  validateCreateItem(item: CreateInventoryItem): void {
    if (!item.itemName || item.itemName.trim() === '') {
      throw new InventoryError('Item name is required', ErrorCode.VALIDATION_ERROR);
    }
    if (item.itemName.length > 100) {
      throw new InventoryError('Item name must be 100 characters or less', ErrorCode.VALIDATION_ERROR);
    }

    if (item.quantity === undefined || item.quantity === null) {
      throw new InventoryError('Quantity is required', ErrorCode.VALIDATION_ERROR);
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 0) {
      throw new InventoryError('Quantity must be a non-negative integer', ErrorCode.VALIDATION_ERROR);
    }

    if (item.price === undefined || item.price === null) {
      throw new InventoryError('Price is required', ErrorCode.VALIDATION_ERROR);
    }
    if (typeof item.price !== 'number' || item.price < 0) {
      throw new InventoryError('Price must be a non-negative number', ErrorCode.VALIDATION_ERROR);
    }

    if (!item.supplierName || item.supplierName.trim() === '') {
      throw new InventoryError('Supplier name is required', ErrorCode.VALIDATION_ERROR);
    }

    const validCategories = Object.values(Category);
    if (!validCategories.includes(item.category as Category)) {
      throw new InventoryError(
        `Invalid category. Must be one of: ${validCategories.join(', ')}`,
        ErrorCode.VALIDATION_ERROR
      );
    }
  }

  /**
   * Validate update item data
   */
  validateUpdateItem(item: UpdateInventoryItem): void {
    if (item.quantity !== undefined && (!Number.isInteger(item.quantity) || item.quantity < 0)) {
      throw new InventoryError('Quantity must be a non-negative integer', ErrorCode.VALIDATION_ERROR);
    }

    if (item.price !== undefined && (typeof item.price !== 'number' || item.price < 0)) {
      throw new InventoryError('Price must be a non-negative number', ErrorCode.VALIDATION_ERROR);
    }

    if (item.category !== undefined) {
      const validCategories = Object.values(Category);
      if (!validCategories.includes(item.category as Category)) {
        throw new InventoryError(
          `Invalid category. Must be one of: ${validCategories.join(', ')}`,
          ErrorCode.VALIDATION_ERROR
        );
      }
    }
  }

  /**
   * Prepare payload for create operation
   * Ensures all required fields are present
   */
  private prepareCreatePayload(item: CreateInventoryItem): any {
    return {
      itemName: item.itemName.trim(),
      category: item.category,
      quantity: item.quantity,
      price: item.price,
      supplierName: item.supplierName.trim(),
      stockStatus: item.stockStatus || StockStatus.IN_STOCK,
      featuredItem: item.featuredItem || 0,
      specialNote: item.specialNote?.trim() || ''
    };
  }

  /**
   * Refresh inventory from server
   */
  refreshInventory(): void {
    this.loadInventory();
  }

  /**
   * Check if item exists by name
   */
  itemExists(name: string): Observable<boolean> {
    return this.getItemByName(name).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
