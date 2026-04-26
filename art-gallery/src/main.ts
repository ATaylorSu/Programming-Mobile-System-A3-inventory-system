/**
 * Application Entry Point
 *
 * Author: Haozhe Song
 * Student ID: 24832672
 * Course: PROG2005 Programming Mobile Systems
 */

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
