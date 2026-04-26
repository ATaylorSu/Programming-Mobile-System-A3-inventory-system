/**
 * Auth Service
 * Student: JiemingLiu
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part1 - Phase 4 (Navigation and Routing)
 * Description: Service for handling user authentication
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'inventory_auth';
  private isAuthenticatedSubject: BehaviorSubject<boolean>;

  constructor() {
    const storedAuth = localStorage.getItem(this.AUTH_KEY);
    const isLoggedIn = storedAuth === 'true';
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(isLoggedIn);
  }

  login(username: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.validateCredentials(username, password)) {
          localStorage.setItem(this.AUTH_KEY, 'true');
          this.isAuthenticatedSubject.next(true);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 800);
    });
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
    this.isAuthenticatedSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  isLoggedIn$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getAuthStatus(): boolean {
    const storedAuth = localStorage.getItem(this.AUTH_KEY);
    return storedAuth === 'true';
  }

  private validateCredentials(username: string, password: string): boolean {
    const validUsers = [
      { username: 'admin', password: 'admin123' },
      { username: 'user', password: 'user123' },
      { username: 'manager', password: 'manager123' }
    ];

    return validUsers.some(
      user => user.username === username && user.password === password
    );
  }
}
