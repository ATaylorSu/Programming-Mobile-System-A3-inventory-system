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
import { Tab1Page } from './tab1.page';
import { Tab2Page } from './tab2.page';
import { Tab3Page } from './tab3.page';
import { Tab4Page } from './tab4.page';

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
    list: Tab1Page,
    add: Tab2Page,
    manage: Tab3Page,
    privacy: Tab4Page
  };

  navigate(tab: string): void {
    this.currentTab = tab;
    this.nav.setRoot(this.pages[tab], { tab });
  }

  toggleHelp(): void {
    this.showHelpModal = !this.showHelpModal;
  }
}
