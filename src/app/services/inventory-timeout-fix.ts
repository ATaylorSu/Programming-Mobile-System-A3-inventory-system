/**
 * Enhanced Inventory Service - Timeout and Retry Configuration
 * Student: HaozheSong (ID: 24832672)
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part1 - Phase 3a (API Service Layer)
 * Description: Enhanced timeout handling and retry configuration
 *              for reliable API communication
 *
 * Features:
 * - Increased timeout to handle slow network conditions
 * - Exponential backoff retry mechanism
 * - Detailed error logging for debugging
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  /**
   * Request timeout in milliseconds
   * Increased from default 5000ms to handle slow network conditions
   */
  private readonly TIMEOUT_MS = 10000;

  /**
   * Maximum number of retry attempts for failed requests
   */
  private readonly MAX_RETRIES = 3;

  /**
   * Base delay for exponential backoff (in milliseconds)
   * Delays will be: 1000ms, 2000ms, 4000ms for retries 1, 2, 3
   */
  private readonly RETRY_DELAY_MS = 1000;

  /**
   * API base URL for the inventory service
   */
  private readonly API_BASE_URL = 'https://prog2005.it.scu.edu.au/ArtGalley';

  constructor(private http: HttpClient) {}

  /**
   * Calculate retry delay with exponential backoff
   * @param retryCount - The current retry attempt number (1-based)
   * @returns The delay in milliseconds before the next retry
   */
  private calculateRetryDelay(retryCount: number): number {
    return this.RETRY_DELAY_MS * Math.pow(2, retryCount - 1);
  }

  /**
   * Get retry strategy with exponential backoff
   * Automatically retries failed requests up to MAX_RETRIES times
   */
  private getRetryStrategy() {
    return retry({
      count: this.MAX_RETRIES,
      delay: (error, retryCount) => {
        const delay = this.calculateRetryDelay(retryCount);
        console.log(`Retry attempt ${retryCount}/${this.MAX_RETRIES} after ${delay}ms delay`);
        return timer(delay);
      }
    });
  }

  /**
   * Handle HTTP errors and timeout errors
   * Provides user-friendly error messages
   */
  private handleError(error: any): Observable<never> {
    if (error.name === 'TimeoutError') {
      const message = 'Request timed out. Please check your network connection and try again.';
      console.error('Timeout Error:', message);
      return throwError(() => new Error(message));
    }

    if (error.status === 0) {
      const message = 'Unable to connect to the server. Please check your internet connection.';
      console.error('Network Error:', message);
      return throwError(() => new Error(message));
    }

    console.error('HTTP Error:', error.status, error.statusText);
    return throwError(() => error);
  }

  /**
   * Fetch all inventory items from the API
   */
  getAllItems(): Observable<any[]> {
    return this.http.get<any[]>(this.API_BASE_URL).pipe(
      timeout(this.TIMEOUT_MS),
      this.getRetryStrategy(),
      catchError(this.handleError)
    );
  }

  /**
   * Fetch a single item by name
   * @param name - The item name to search for
   */
  getItemByName(name: string): Observable<any> {
    const encodedName = encodeURIComponent(name);
    return this.http.get<any>(`${this.API_BASE_URL}/${encodedName}`).pipe(
      timeout(this.TIMEOUT_MS),
      this.getRetryStrategy(),
      catchError(this.handleError)
    );
  }

  /**
   * Create a new inventory item
   * @param item - The item data to create
   */
  createItem(item: any): Observable<any> {
    return this.http.post<any>(this.API_BASE_URL, item).pipe(
      timeout(this.TIMEOUT_MS),
      this.getRetryStrategy(),
      catchError(this.handleError)
    );
  }

  /**
   * Update an existing inventory item
   * @param name - The item name to update
   * @param updates - The update data
   */
  updateItem(name: string, updates: any): Observable<any> {
    const encodedName = encodeURIComponent(name);
    return this.http.put<any>(`${this.API_BASE_URL}/${encodedName}`, updates).pipe(
      timeout(this.TIMEOUT_MS),
      this.getRetryStrategy(),
      catchError(this.handleError)
    );
  }

  /**
   * Delete an inventory item
   * @param name - The item name to delete
   */
  deleteItem(name: string): Observable<any> {
    const encodedName = encodeURIComponent(name);
    return this.http.delete<any>(`${this.API_BASE_URL}/${encodedName}`).pipe(
      timeout(this.TIMEOUT_MS),
      this.getRetryStrategy(),
      catchError(this.handleError)
    );
  }
}
