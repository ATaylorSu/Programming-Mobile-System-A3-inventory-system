/**
 * Tabs Module
 * Defines the tab navigation structure
 *
 * Author: Haozhe Song
 * Student ID: 24832672
 * Course: PROG2005 Programming Mobile Systems
 */

import { IonicModule } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Tab1Page } from './tab1.page';
import { Tab2Page } from './tab2.page';
import { Tab3Page } from './tab3.page';
import { Tab4Page } from './tab4.page';
import { TabsPage } from './tabs.page';
import { TabsPageRoutingModule } from './tabs.router.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TabsPageRoutingModule
  ],
  declarations: [
    TabsPage,
    Tab1Page,
    Tab2Page,
    Tab3Page,
    Tab4Page
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TabsPageModule {}
