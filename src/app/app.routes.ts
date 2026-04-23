/**
 * Application Routes Configuration
 * Student: BoLi
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part1
 * Description: Defines the main routing structure for the application
 */

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then(m => m.tabsRoutes)
  }
];
