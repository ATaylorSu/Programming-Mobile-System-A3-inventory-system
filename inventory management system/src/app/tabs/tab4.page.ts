/**
 * Tab 4 - Privacy & Security Page Component
 * Displays privacy and security information about the application
 *
 * Author: Haozhe Song
 * Student ID: 24832672
 * Course: PROG2005 Programming Mobile Systems
 */

import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page {

  constructor(private alertCtrl: AlertController) {}

  /**
   * Show help information
   */
  async showHelp(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Help - Privacy Page',
      message: `
        <p><strong>Privacy & Security Page</strong></p>
        <p>This page explains how your data is handled, stored, and protected.</p>
        <p><strong>Key Points:</strong></p>
        <ul style="text-align: left;">
          <li>All data is stored on SCU servers</li>
          <li>Data is transmitted over HTTPS</li>
          <li>Each user has their own data view</li>
        </ul>
      `,
      buttons: ['Got it!'],
      cssClass: 'custom-alert'
    });
    await alert.present();
  }

  /**
   * Expand/collapse sections
   */
  expandedSection: string | null = null;

  toggleSection(section: string): void {
    this.expandedSection = this.expandedSection === section ? null : section;
  }

  isExpanded(section: string): boolean {
    return this.expandedSection === section;
  }
}
