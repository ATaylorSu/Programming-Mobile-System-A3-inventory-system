# Inventory Management System - A3 Part1 Phase 3c

## Team Information
- **Team Project**
- **Course**: PROG2005 Programming Mobile Systems
- **Assessment**: A3 Part1 Phase 3c
- **Student**: BoLi

## Phase 3c Overview
This phase extends the Inventory Management System with Ionic Native components integration, including camera, geolocation, and enhanced storage capabilities.

## New Features

### 1. Camera Integration (`camera.service.3c.ts`)
- **Camera Service** for capturing photos using device camera
- **Image Picker** for selecting images from gallery
- **Image Compression** with configurable quality settings
- **Filesystem Integration** for saving and reading images

### 2. Geolocation Integration (`geolocation.service.3c.ts`)
- **Current Location** retrieval with accuracy data
- **Location Permission** handling
- **Distance Calculation** using Haversine formula
- **Coordinate Formatting** for display

### 3. Enhanced Storage (`storage.service.3c.ts`)
- **Encrypted Storage** using Ionic Storage
- **Offline Caching** for inventory items
- **User Preferences** persistence
- **Search History** management
- **Draft Items** for form auto-save

### 4. Reusable Components
- **Image Capture Component** (`image-capture.component.3c.ts`)
- **Offline Banner Component** (`offline-banner.component.3c.ts`)
- **Search History Component** (`search-history.component.3c.ts`)
- **Loading Skeleton Component** (`loading-skeleton.component.3c.ts`)

### 5. Enhanced Pages
- **Location Picker Page** (`location-picker-page.3c.ts`)
- **Advanced Inventory List** (`inventory-list-advanced-page.3c.ts`)

## Installation & Setup

### Required Packages
```bash
npm install @capacitor/camera
npm install @capacitor/filesystem
npm install @capacitor/geolocation
npm install @capacitor/network
npm install @ionic/storage-angular
```

### Capacitor Configuration
Add required permissions to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### iOS Permissions (Info.plist)
```xml
<key>NSCameraUsageDescription</key>
<string>This app needs camera access to capture inventory photos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs photo library access to select inventory images</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs location access to track inventory locations</string>
```

## File Structure
```
阶段3c/
├── src/
│   └── app/
│       ├── components/
│       │   ├── image-capture.component.3c.ts
│       │   ├── offline-banner.component.3c.ts
│       │   ├── search-history.component.3c.ts
│       │   └── loading-skeleton.component.3c.ts
│       ├── pages/
│       │   ├── location-picker-page.3c.ts
│       │   └── inventory-list-advanced-page.3c.ts
│       └── services/
│           ├── camera.service.3c.ts
│           ├── camera.service.3c.spec.ts
│           ├── geolocation.service.3c.ts
│           ├── geolocation.service.3c.spec.ts
│           ├── storage.service.3c.ts
│           └── storage.service.3c.spec.ts
└── README.md
```

## Testing
Run unit tests:
```bash
ng test
```

Run specific test file:
```bash
ng test --include='**/storage.service.3c.spec.ts'
```

## Native Features Summary

| Feature | Service | Platform Support |
|---------|---------|------------------|
| Camera | CameraService3c | iOS, Android |
| Gallery | CameraService3c | iOS, Android |
| Geolocation | GeolocationService3c | iOS, Android |
| Offline Mode | StorageService3c | All |
| Encrypted Storage | StorageService3c | All |

## Help Widget Integration
Each component includes help functionality accessible via the help button in the toolbar.

## Technologies Used
- Ionic Framework
- Angular 17+
- TypeScript
- Capacitor Native Plugins
- Ionic Storage
