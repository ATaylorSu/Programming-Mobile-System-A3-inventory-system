/**
 * Inventory Model Tests
 * Student: BoLi
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part2b
 * Description: Unit tests for inventory data models
 */

import { Category, InventoryItem } from './inventory.model';

describe('InventoryModel', () => {
  describe('Category Enum', () => {
    it('should have correct category values', () => {
      expect(Category.ELECTRONICS).toBe('Electronics');
      expect(Category.FURNITURE).toBe('Furniture');
      expect(Category.CLOTHING).toBe('Clothing');
      expect(Category.BOOKS).toBe('Books');
      expect(Category.FOOD).toBe('Food');
      expect(Category.OTHER).toBe('Other');
    });
  });

  describe('InventoryItem Interface', () => {
    it('should create a valid inventory item', () => {
      const item: InventoryItem = {
        name: 'Test Item',
        price: 99.99,
        description: 'Test description',
        category: Category.ELECTRONICS,
        featured: true
      };

      expect(item.name).toBe('Test Item');
      expect(item.price).toBe(99.99);
      expect(item.category).toBe(Category.ELECTRONICS);
      expect(item.featured).toBe(true);
    });
  });
});
