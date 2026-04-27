# Inventory Management System - A3 Part1

/**
* Inventory Management System - A3 Part1
* 
* ============================================================================
* 
* Project Overview
* ----------------
* This is a cross platform mobile application built using Ionic Framework
* Allow users to manage inventory databases through RESTful API interactions.
* 
* This application extends A2's Angular web application and provides a
* mobile friendly interface with native functionality.
* ============================================================================
* 
* Characteristics
* ---------------
* 1. List page (tab 1)
* - View all inventory items
* - Pull to refresh function
* - Featured product indicators
* 
* 2. Add Page (Tab 2)
* - Add new inventory items
* - Form validation
* - Featured products section
* 
* 3. Management page (tab 3)
* - Update existing projects
* - Delete project (after confirmation)
* - Protected items (laptops cannot be deleted)
* 
* 4. Privacy page (tab 4)
* - Data storage information
* - Safety Practice
* - API file
* ============================================================================
* 
* Data Fields
* -----------
* - Project ID (auto increment, unique)
* - Project Name (required, unique)
* - Category (electronic products, furniture, clothing, tools, miscellaneous)
* - Quantity (required, integer)
* - Price (required, integer)
* - Supplier Name (required)
* - Inventory status (in stock, low stock, out of stock)
* - Featured_Item (0 or 1, default value: 0)
* - Special instructions (optional)
* ============================================================================
* 
* API endpoint
* ------------
* Basic URL: https://prog2005.it.scu.edu.au/ArtGalley
* 
* GET / - Get all projects
* GET /{name} - Retrieve projects by name
* POST / - Create New Project
* PUT /{name} - Update existing projects
* DELETE /{name} - Delete Project
* 
* Note: The "Laptop" item cannot be deleted
* ============================================================================
* 
* Installation and operation
* --------------------------
* Install dependencies:
* npm install
* 
* Run in development mode:
* npm start
* Or
* ionic serve
* 
* Production and construction:
* npm run build
* 
* Add a mobile platform:
* ionic cordova platform add android
* ionic cordova platform add ios
* 
* Run on the device/simulator:
* ionic cordova run android
* ionic cordova run ios
* ============================================================================
* 
* Project Structure
* -----------------
* art-gallery/
* ├── src/
* │   ├── app/
* │   │   ├── models/
* │   │   │   └── inventory.model.ts # Data models & interfaces
* │   │   ├── services/
* │   │   │   └── inventory.service.ts # API service
* │   │   ├── tabs/
* │   │   │   ├── tab1.page.ts # List page component
* │   │   │   ├── tab2.page.ts # Add page component
* │   │   │   ├── tab3.page.ts # Manage page component
* │   │   │   ├── tab4.page.ts # Privacy page component
* │   │   │   ├── tabs.page.ts # Tab container
* │   │   │   ├── tabs.module.ts # Tab module
* │   │   │   └── tabs.router.module.ts # Tab routing
* │   │   ├── app.component.ts # Root component
* │   │   ├── app.module.ts # Root module
* │   │   └── app-routing.module.ts # Root routing
* │   ├── environments/
* │   │   ├── environment.ts # Dev environment
* │   │   └── environment.prod.ts # Production environment
* │   ├── theme/
* │   │   └── variables.scss # Ionic theme variables
* │   ├── global.scss # Global styles
* │   ├── index.html # Entry HTML
* │   └── main.ts # Entry point
* ├── angular.json # Angular CLI config
* ├── tsconfig.json # TypeScript config
* └── package.json # Dependencies
* ============================================================================
* 
* Technologies Used
* -----------------
* Angular 17
* Ionic 7
* TypeScript 5.2
* SCSS
* HttpClient for API calls
* ============================================================================
* 
* Testing
* -------
* Web: ionic serve (or npm start)
* Mobile: Test on physical device or emulator
* 
* Note: Some features (like native plugins) require actual device testing
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

// Note: The search functionality may occasionally have bugs.
