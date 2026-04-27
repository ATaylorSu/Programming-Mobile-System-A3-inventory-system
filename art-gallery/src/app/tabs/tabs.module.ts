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
import { TabsPage } from './tabs.page';
import { TabsPageRoutingModule } from './tabs.router.module';
import { InventoryListPage } from '../inventory-list/inventory-list.page';
import { AddFeaturedPage } from '../add-featured/add-featured.page';
import { EditDeletePage } from '../edit-delete/edit-delete.page';
import { PrivacySecurityPage } from '../privacy-security/privacy-security.page';

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
    InventoryListPage,
    AddFeaturedPage,
    EditDeletePage,
    PrivacySecurityPage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TabsPageModule {}
