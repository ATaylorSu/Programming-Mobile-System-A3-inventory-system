/**
 * Inventory Model Unit Tests
 * Student: HaozheSong (ID: 24832672)
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part1 - Phase 3a (API Service Layer)
 * Description: Unit tests for inventory data models and validation
 */

import {
  InventoryItem,
  CreateInventoryItem,
  UpdateInventoryItem,
  Category,
  StockStatus,
  VALID_CATEGORIES,
  VALID_STOCK_STATUSES
} from './inventory.model';

describe('InventoryItem Model', () => {
  it('should create a valid inventory item', () => {
    const item: InventoryItem = {
      itemName: 'Test Laptop',
      category: Category.ELECTRONICS,
      quantity: 10,
      price: 999.99,
      supplierName: 'Tech Supplier',
      stockStatus: StockStatus.IN_STOCK,
      featuredItem: 1,
      specialNote: 'High performance'
    };

    expect(item.itemName).toBe('Test Laptop');
    expect(item.category).toBe(Category.ELECTRONICS);
    expect(item.quantity).toBe(10);
    expect(item.price).toBe(999.99);
    expect(item.supplierName).toBe('Tech Supplier');
    expect(item.stockStatus).toBe(StockStatus.IN_STOCK);
    expect(item.featuredItem).toBe(1);
    expect(item.specialNote).toBe('High performance');
  });

  it('should have optional fields', () => {
    const item: InventoryItem = {
      itemName: 'Basic Item',
      category: Category.MISCELLANEOUS,
      quantity: 5,
      price: 49.99,
      supplierName: 'Generic Supplier',
      stockStatus: StockStatus.IN_STOCK,
      featuredItem: 0
    };

    expect(item.itemId).toBeUndefined();
    expect(item.specialNote).toBeUndefined();
  });
});

describe('Category Enum', () => {
  it('should have all required categories', () => {
    expect(Category.ELECTRONICS).toBe('Electronics');
    expect(Category.FURNITURE).toBe('Furniture');
    expect(Category.CLOTHING).toBe('Clothing');
    expect(Category.TOOLS).toBe('Tools');
    expect(Category.MISCELLANEOUS).toBe('Miscellaneous');
  });

    it('should match VALID_CATEGORIES array', () => {
    const enumValues = Object.values(Category);
    expect(enumValues.length).toBe(VALID_CATEGORIES.length);
    for (const cat of VALID_CATEGORIES) {
      expect(enumValues).toContain(cat as Category);
    }
  });
});

describe('StockStatus Enum', () => {
  it('should have all required stock statuses', () => {
    expect(StockStatus.IN_STOCK).toBe('In Stock');
    expect(StockStatus.LOW_STOCK).toBe('Low Stock');
    expect(StockStatus.OUT_OF_STOCK).toBe('Out of Stock');
  });

    it('should match VALID_STOCK_STATUSES array', () => {
    const enumValues = Object.values(StockStatus);
    expect(enumValues.length).toBe(VALID_STOCK_STATUSES.length);
    for (const status of VALID_STOCK_STATUSES) {
      expect(enumValues).toContain(status as StockStatus);
    }
  });
});

describe('CreateInventoryItem Interface', () => {
  it('should create a valid create item payload', () => {
    const newItem: CreateInventoryItem = {
      itemName: 'New Product',
      category: 'Electronics',
      quantity: 20,
      price: 299.99,
      supplierName: 'Best Supplier',
      stockStatus: 'In Stock',
      featuredItem: 1,
      specialNote: 'New arrival'
    };

    expect(newItem.itemName).toBe('New Product');
    expect(newItem.category).toBe('Electronics');
    expect(newItem.quantity).toBe(20);
    expect(newItem.price).toBe(299.99);
    expect(newItem.supplierName).toBe('Best Supplier');
  });

  it('should have optional fields with defaults', () => {
    const minimalItem: CreateInventoryItem = {
      itemName: 'Minimal Product',
      category: 'Miscellaneous',
      quantity: 1,
      price: 9.99,
      supplierName: 'Quick Supplier'
    };

    expect(minimalItem.stockStatus).toBeUndefined();
    expect(minimalItem.featuredItem).toBeUndefined();
    expect(minimalItem.specialNote).toBeUndefined();
  });
});

describe('UpdateInventoryItem Interface', () => {
  it('should allow partial updates', () => {
    const partialUpdate: UpdateInventoryItem = {
      price: 399.99,
      quantity: 15
    };

    expect(partialUpdate.price).toBe(399.99);
    expect(partialUpdate.quantity).toBe(15);
    expect(partialUpdate.category).toBeUndefined();
    expect(partialUpdate.supplierName).toBeUndefined();
  });

  it('should support full update', () => {
    const fullUpdate: UpdateInventoryItem = {
      category: 'Electronics',
      quantity: 50,
      price: 799.99,
      supplierName: 'New Supplier',
      stockStatus: 'Low Stock',
      featuredItem: 1,
      specialNote: 'Updated description'
    };

    expect(Object.keys(fullUpdate).length).toBe(7);
  });
});
