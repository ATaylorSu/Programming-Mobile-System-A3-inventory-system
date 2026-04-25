/**
 * Privacy Security Page Component
 * Student: BoLi
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part1
 * Description: Page displaying privacy and security analysis for the inventory application
 */

import { Component } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy-security',
  templateUrl: './privacy-security.page.html',
  styleUrls: ['./privacy-security.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class PrivacySecurityPage {
  constructor(private alertCtrl: AlertController) {}

  async showHelp(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Help - Privacy & Security',
      message: `
        <p><strong>About this page:</strong></p>
        <ul>
          <li>This page explains the privacy and security measures implemented in our application.</li>
          <li>Review the content to understand how we protect your data.</li>
        </ul>
      `,
      buttons: ['OK']
    });
    await alert.present();
  }
}
