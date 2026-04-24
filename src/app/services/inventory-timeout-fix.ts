/**
 * Bug Fix: API Connection Timeout Handling
 * Student: BoLi
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part2b
 * Description: Fixed timeout handling for slow network connections
 *
 * Changes:
 * - Increased default timeout from 5000ms to 10000ms
 * - Added retry mechanism with exponential backoff
 * - Improved error messages for timeout scenarios
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry, timeout, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  // Increased timeout to handle slow network conditions
  private readonly TIMEOUT_MS = 10000;
  // Maximum retry attempts
  private readonly MAX_RETRIES = 3;
  // Base delay for exponential backoff
  private readonly RETRY_DELAY_MS = 1000;

  constructor(private http: HttpClient) {}

  /**
   * Enhanced retry mechanism with exponential backoff
   * Automatically retries failed requests up to MAX_RETRIES times
   */
  private getRetryStrategy() {
    return retry({
      count: this.MAX_RETRIES,
      delay: (error, retryCount) => {
        const delay = this.RETRY_DELAY_MS * Math.pow(2, retryCount - 1);
        console.log(`Retry attempt ${retryCount} after ${delay}ms delay`);
        return timer(delay);
      }
    });
  }

  getAllItems(): Observable<any[]> {
    return this.http.get<any[]>('https://prog2005.it.scu.edu.au/ArtGalley').pipe(
      timeout(this.TIMEOUT_MS),
      this.getRetryStrategy(),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    if (error.name === 'TimeoutError') {
      console.error('Request timed out. Please check your network connection.');
      return throwError(() => new Error('Request timed out. Please try again.'));
    }
    return throwError(() => error);
  }
}
