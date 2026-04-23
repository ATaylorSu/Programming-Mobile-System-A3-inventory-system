/**
 * Inventory Service - API Integration Layer
 * Student: HaozheSong
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part2a
 * Description: Service layer for communicating with the inventory REST API
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, retry, timeout } from 'rxjs/operators';
import {
  InventoryItem,
  CreateInventoryItem,
  UpdateInventoryItem,
  ApiResponse
} from '../models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private readonly API_BASE_URL = 'https://prog2005.it.scu.edu.au/ArtGalley';
  private readonly TIMEOUT_MS = 10000;
  private readonly MAX_RETRIES = 3;

  private inventorySubject = new BehaviorSubject<InventoryItem[]>([]);
  public inventory$ = this.inventorySubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInventory();
  }

  private getHttpHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = `Bad Request: ${error.error?.message || 'Invalid data provided'}`;
          break;
        case 404:
          errorMessage = 'Resource not found';
          break;
        case 409:
          errorMessage = 'Conflict: Item already exists';
          break;
        case 500:
          errorMessage = 'Server error: Please try again later';
          break;
        default:
          errorMessage = `Server Error: ${error.status} - ${error.statusText}`;
      }
    }

    console.error('InventoryService Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }

  private loadInventory(): void {
    this.getAllItems().subscribe({
      next: (items) => this.inventorySubject.next(items),
      error: (err) => console.error('Failed to load inventory:', err)
    });
  }

  /**
   * Retrieve all inventory items from the API
   */
  getAllItems(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.API_BASE_URL).pipe(
      timeout(this.TIMEOUT_MS),
      retry({ count: this.MAX_RETRIES, delay: 1000 }),
      catchError(this.handleError)
    );
  }

  /**
   * Retrieve a single inventory item by name
   */
  getItemByName(name: string): Observable<InventoryItem> {
    const encodedName = encodeURIComponent(name);
    return this.http.get<InventoryItem>(`${this.API_BASE_URL}/${encodedName}`).pipe(
      timeout(this.TIMEOUT_MS),
      retry({ count: this.MAX_RETRIES, delay: 1000 }),
      catchError(this.handleError)
    );
  }

  /**
   * Create a new inventory item
   */
  createItem(item: CreateInventoryItem): Observable<InventoryItem> {
    this.validateItem(item);
    return this.http.post<InventoryItem>(this.API_BASE_URL, item, {
      headers: this.getHttpHeaders()
    }).pipe(
      timeout(this.TIMEOUT_MS),
      retry({ count: this.MAX_RETRIES, delay: 1000 }),
      catchError(this.handleError)
    );
  }

  /**
   * Update an existing inventory item by name
   */
  updateItem(name: string, updates: UpdateInventoryItem): Observable<InventoryItem> {
    const encodedName = encodeURIComponent(name);
    return this.http.put<InventoryItem>(`${this.API_BASE_URL}/${encodedName}`, updates, {
      headers: this.getHttpHeaders()
    }).pipe(
      timeout(this.TIMEOUT_MS),
      retry({ count: this.MAX_RETRIES, delay: 1000 }),
      catchError(this.handleError)
    );
  }

  /**
   * Delete an inventory item by name
   */
  deleteItem(name: string): Observable<ApiResponse<null>> {
    const encodedName = encodeURIComponent(name);
    return this.http.delete<ApiResponse<null>>(`${this.API_BASE_URL}/${encodedName}`).pipe(
      timeout(this.TIMEOUT_MS),
      retry({ count: this.MAX_RETRIES, delay: 1000 }),
      catchError(this.handleError)
    );
  }

  /**
   * Search inventory items by name
   */
  searchItems(query: string): Observable<InventoryItem[]> {
    return this.getAllItems().pipe(
      map((items) => {
        if (!query || query.trim() === '') {
          return items;
        }
        const lowerQuery = query.toLowerCase();
        return items.filter(item =>
          item.name.toLowerCase().includes(lowerQuery) ||
          item.description.toLowerCase().includes(lowerQuery)
        );
      })
    );
  }

  /**
   * Get featured items only
   */
  getFeaturedItems(): Observable<InventoryItem[]> {
    return this.getAllItems().pipe(
      map((items) => items.filter(item => item.featured))
    );
  }

  /**
   * Validate inventory item data
   */
  validateItem(item: CreateInventoryItem | UpdateInventoryItem): void {
    if ('name' in item) {
      if (!item.name || item.name.trim() === '') {
        throw new Error('Item name is required');
      }
      if (item.name.length > 100) {
        throw new Error('Item name must be 100 characters or less');
      }
    }

    if ('price' in item && item.price !== undefined) {
      if (typeof item.price !== 'number' || item.price < 0) {
        throw new Error('Price must be a non-negative number');
      }
    }
  }

  /**
   * Refresh inventory from server
   */
  refreshInventory(): void {
    this.loadInventory();
  }
}
