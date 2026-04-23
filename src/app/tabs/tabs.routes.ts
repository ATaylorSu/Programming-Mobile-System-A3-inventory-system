/**
 * Tabs Routing Configuration
 * Student: BoLi
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part1
 * Description: Defines routes for the tab-based navigation structure
 */

import { Routes } from '@angular/router';

export const tabsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'inventory-list',
    pathMatch: 'full'
  },
  {
    path: 'inventory-list',
    loadComponent: () => import('../inventory-list/inventory-list.page').then(m => m.InventoryListPage)
  },
  {
    path: 'add-featured',
    loadComponent: () => import('../add-featured/add-featured.page').then(m => m.AddFeaturedPage)
  },
  {
    path: 'edit-delete',
    loadComponent: () => import('../edit-delete/edit-delete.page').then(m => m.EditDeletePage)
  },
  {
    path: 'privacy-security',
    loadComponent: () => import('../privacy-security/privacy-security.page').then(m => m.PrivacySecurityPage)
  }
];
