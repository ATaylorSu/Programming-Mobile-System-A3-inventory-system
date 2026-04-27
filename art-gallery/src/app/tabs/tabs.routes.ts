/**
 * Tabs Routes
 * Defines child routes for the tabs navigation
 *
 * Author: Haozhe Song
 * Student ID: 24832672
 * Course: PROG2005 Programming Mobile Systems
 */

import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const TABS_ROUTES: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: 'inventory-list',
        pathMatch: 'full'
      },
      {
        path: 'inventory-list',
        loadChildren: () => import('../inventory-list/inventory-list.module').then(m => m.InventoryListPageModule)
      },
      {
        path: 'add-featured',
        loadChildren: () => import('../add-featured/add-featured.module').then(m => m.AddFeaturedPageModule)
      },
      {
        path: 'edit-delete',
        loadChildren: () => import('../edit-delete/edit-delete.module').then(m => m.EditDeletePageModule)
      },
      {
        path: 'privacy-security',
        loadChildren: () => import('../privacy-security/privacy-security.module').then(m => m.PrivacySecurityPageModule)
      }
    ]
  }
];
