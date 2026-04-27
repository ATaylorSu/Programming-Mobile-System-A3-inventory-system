/**
 * Tabs Page Component
 * Main navigation container with top header navigation bar
 *
 * Author: Haozhe Song
 * Student ID: 24832672
 * Course: PROG2005 Programming Mobile Systems
 */

import { Component, ViewChild } from '@angular/core';
import { IonNav } from '@ionic/angular';
import { InventoryListPage } from '../inventory-list/inventory-list.page';
import { AddFeaturedPage } from '../add-featured/add-featured.page';
import { EditDeletePage } from '../edit-delete/edit-delete.page';
import { PrivacySecurityPage } from '../privacy-security/privacy-security.page';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  @ViewChild('nav', { static: false }) nav!: IonNav;

  currentTab: string = 'list';
  showHelpModal: boolean = false;

  pages: { [key: string]: any } = {
    list: InventoryListPage,
    add: AddFeaturedPage,
    manage: EditDeletePage,
    privacy: PrivacySecurityPage
  };

  navigate(tab: string): void {
    this.currentTab = tab;
    this.nav.setRoot(this.pages[tab], { tab });
  }

  toggleHelp(): void {
    this.showHelpModal = !this.showHelpModal;
  }
}
