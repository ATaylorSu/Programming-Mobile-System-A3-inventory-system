/**
 * Inventory Service - RESTful API Communication
 *
 * Author: Haozhe Song
 * Student ID: 24832672
 * Course: PROG2005 Programming Mobile Systems
 *
 * Handles all HTTP communication with the ArtGalley REST API
 * API Endpoint: https://prog2005.it.scu.edu.au/ArtGalley
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  InventoryItem,
  CreateInventoryItemDTO,
  UpdateInventoryItemDTO,
  OperationResult,
  ApiError
} from '../models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  // Base API URL
  private apiUrl = environment.apiUrl;

  // HTTP headers for JSON content
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 200 && error.error?.text) {
        // Handle text response (common with DELETE operations)
        return throwError(() => ({
          success: false,
          error: error.error.text || 'Operation completed but returned unexpected response'
        }));
      }
      errorMessage = error.error?.error || error.error?.message || `Server Error: ${error.status}`;
    }

    console.error('API Error:', errorMessage, error);
    return throwError(() => () => ({ success: false, error: errorMessage }));
  }

  /**
   * Get all inventory items
   * GET /ArtGalley
   */
  getAllItems(): Observable<OperationResult<InventoryItem[]>> {
    return this.http.get<InventoryItem[]>(this.apiUrl, this.httpOptions).pipe(
      retry(2),
      map((data) => ({ success: true, data })),
      catchError(this.handleError)
    );
  }

  /**
   * Get a single item by name
   * GET /ArtGalley/{name}
   */
  getItemByName(name: string): Observable<OperationResult<InventoryItem>> {
    const encodedName = encodeURIComponent(name);
    return this.http.get<InventoryItem>(`${this.apiUrl}/${encodedName}`, this.httpOptions).pipe(
      map((data) => ({ success: true, data })),
      catchError(this.handleError)
    );
  }

  /**
   * Create a new inventory item
   * POST /ArtGalley
   */
  createItem(item: CreateInventoryItemDTO): Observable<OperationResult<InventoryItem>> {
    return this.http.post<InventoryItem>(this.apiUrl, item, this.httpOptions).pipe(
      map((data) => ({ success: true, data })),
      catchError(this.handleError)
    );
  }

  /**
   * Update an existing inventory item
   * PUT /ArtGalley/{name}
   */
  updateItem(name: string, item: UpdateInventoryItemDTO): Observable<OperationResult<InventoryItem>> {
    const encodedName = encodeURIComponent(name);
    return this.http.put<InventoryItem>(`${this.apiUrl}/${encodedName}`, item, this.httpOptions).pipe(
      map((data) => ({ success: true, data })),
      catchError(this.handleError)
    );
  }

  /**
   * Delete an inventory item
   * DELETE /ArtGalley/{name}
   * Note: Cannot delete "Laptop" - server will return error
   */
  deleteItem(name: string): Observable<OperationResult<{ message: string }>> {
    const encodedName = encodeURIComponent(name);
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${encodedName}`, this.httpOptions).pipe(
      map((data) => ({
        success: true,
        data: data || { message: 'Item deleted successfully' },
        message: data?.message || 'Item deleted successfully'
      })),
      catchError(this.handleError)
    );
  }

  /**
   * Check if API is available
   */
  checkConnection(): Observable<boolean> {
    return this.http.get<InventoryItem[]>(this.apiUrl, this.httpOptions).pipe(
      map(() => true),
      catchError(() => [false])
    );
  }
}
