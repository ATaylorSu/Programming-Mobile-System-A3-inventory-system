/**
 * Login Page Component
 * Student: JiemingLiu
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part1 - Phase 4 (Navigation and Routing)
 * Description: Login page for user authentication before accessing inventory management
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
         IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
         IonCardContent, IonItem, IonLabel, IonInput, IonNote, IonSpinner } from '@ionic/angular/standalone';
import { AuthService } from '../../app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
    IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonCardContent, IonItem, IonLabel, IonInput, IonNote, IonSpinner
  ]
})
export class LoginPage {
  username: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/tabs/inventory-list']);
    }
  }

  async onLogin(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const success = await this.authService.login(this.username.trim(), this.password);

    if (success) {
      this.router.navigate(['/tabs/inventory-list']);
    } else {
      this.errorMessage = 'Invalid username or password. Please try again.';
    }

    this.isLoading = false;
  }

  validateForm(): boolean {
    if (!this.username || this.username.trim() === '') {
      this.errorMessage = 'Username is required';
      return false;
    }

    if (!this.password) {
      this.errorMessage = 'Password is required';
      return false;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return false;
    }

    this.errorMessage = '';
    return true;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  clearError(): void {
    this.errorMessage = '';
  }
}
