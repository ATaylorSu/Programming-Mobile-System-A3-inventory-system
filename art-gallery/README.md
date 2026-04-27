/**
 * Art Gallery - Ionic Mobile Inventory Management System
 *
 * A3 Assessment for PROG2005 Programming Mobile Systems
 *
 * Author: Haozhe Song
 * Student ID: 24832672
 *
 * ============================================================================
 *
 * Project Overview
 * ----------------
 * This is a cross-platform mobile application built with Ionic Framework that
 * allows users to manage an inventory database through RESTful API interactions.
 *
 * The application extends the Angular web application from A2, providing a
 * mobile-friendly interface with native-like features.
 *
 * ============================================================================
 *
 * Features
 * --------
 * 1. List Page (Tab 1)
 *    - View all inventory items
 *    - Search for items by name
 *    - Pull-to-refresh functionality
 *    - Featured item indicators
 *
 * 2. Add Page (Tab 2)
 *    - Add new inventory items
 *    - Form validation
 *    - Featured Items section
 *
 * 3. Manage Page (Tab 3)
 *    - Update existing items
 *    - Delete items (with confirmation)
 *    - Protected items (Laptop cannot be deleted)
 *
 * 4. Privacy Page (Tab 4)
 *    - Data storage information
 *    - Security practices
 *    - API documentation
 *
 * ============================================================================
 *
 * Data Fields
 * -----------
 * - Item_ID (Auto-incrementing, unique)
 * - Item_Name (Required, unique)
 * - Category (Electronics, Furniture, Clothing, Tools, Miscellaneous)
 * - Quantity (Required, integer)
 * - Price (Required, integer)
 * - Supplier_Name (Required)
 * - Stock_Status (In Stock, Low Stock, Out of Stock)
 * - Featured_Item (0 or 1, default: 0)
 * - Special_Note (Optional)
 *
 * ============================================================================
 *
 * API Endpoints
 * -------------
 * Base URL: https://prog2005.it.scu.edu.au/ArtGalley
 *
 * GET    /                     - Get all items
 * GET    /{name}               - Get item by name
 * POST   /                     - Create new item
 * PUT    /{name}               - Update existing item
 * DELETE /{name}               - Delete item
 *
 * Note: The "Laptop" item cannot be deleted
 *
 * ============================================================================
 *
 * Installation & Running
 * ---------------------
 *
 * 1. Install dependencies:
 *    npm install
 *
 * 2. Run in development mode:
 *    npm start
 *    or
 *    ionic serve
 *
 * 3. Build for production:
 *    npm run build
 *
 * 4. Add platforms for mobile:
 *    ionic cordova platform add android
 *    ionic cordova platform add ios
 *
 * 5. Run on device/emulator:
 *    ionic cordova run android
 *    ionic cordova run ios
 *
 * ============================================================================
 *
 * Project Structure
 * ----------------
 *
 * art-gallery/
 * ├── src/
 * │   ├── app/
 * │   │   ├── models/
 * │   │   │   └── inventory.model.ts    # Data models & interfaces
 * │   │   ├── services/
 * │   │   │   └── inventory.service.ts # API service
 * │   │   ├── tabs/
 * │   │   │   ├── tab1.page.ts         # List page component
 * │   │   │   ├── tab2.page.ts         # Add page component
 * │   │   │   ├── tab3.page.ts         # Manage page component
 * │   │   │   ├── tab4.page.ts         # Privacy page component
 * │   │   │   ├── tabs.page.ts         # Tab container
 * │   │   │   ├── tabs.module.ts       # Tab module
 * │   │   │   └── tabs.router.module.ts# Tab routing
 * │   │   ├── app.component.ts        # Root component
 * │   │   ├── app.module.ts           # Root module
 * │   │   └── app-routing.module.ts   # Root routing
 * │   ├── environments/
 * │   │   ├── environment.ts          # Dev environment
 * │   │   └── environment.prod.ts     # Production environment
 * │   ├── theme/
 * │   │   └── variables.scss          # Ionic theme variables
 * │   ├── global.scss                 # Global styles
 * │   ├── index.html                  # Entry HTML
 * │   └── main.ts                     # Entry point
 * ├── angular.json                    # Angular CLI config
 * ├── tsconfig.json                   # TypeScript config
 * └── package.json                    # Dependencies
 *
 * ============================================================================
 *
 * Technologies Used
 * -----------------
 * - Angular 17
 * - Ionic 7
 * - TypeScript 5.2
 * - SCSS
 * - HttpClient for API calls
 *
 * ============================================================================
 *
 * Testing
 * -------
 * - Web: ionic serve (or npm start)
 * - Mobile: Test on physical device or emulator
 * - Note: Some features (like native plugins) require actual device testing
 *
 * ============================================================================
 *
 * License
 * -------
 * This project was created for educational purposes as part of the
 * PROG2005 Programming Mobile Systems course at Southern Cross University.
 *
 * ============================================================================
 */

# Getting Started with Ionic

This project was generated with [Ionic CLI](https://ionicframework.com/docs/cli) and [Angular](https://angular.io/).

## Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Open in browser
# Navigate to http://localhost:8100
```

## Mobile Development

```bash
# Add Android platform
ionic cordova platform add android

# Add iOS platform
ionic cordova platform add ios

# Build for Android
ionic cordova build android

# Run on Android device/emulator
ionic cordova run android

# Run on iOS simulator
ionic cordova run ios
```

## API Configuration

The application connects to:
- **Development**: `https://prog2005.it.scu.edu.au/ArtGalley`
- API endpoints are configured in `src/environments/environment.ts`

## Author

- **Name**: Haozhe Song
- **Student ID**: 24832672
- **Course**: PROG2005 Programming Mobile Systems
- **Assessment**: A3 - Ionic Mobile Inventory Management System
