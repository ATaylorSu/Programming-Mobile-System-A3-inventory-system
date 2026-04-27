/**
 * Inventory Service Integration Tests
 * Student: HaozheSong (ID: 24832672)
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part1 - Phase 3a (API Service Layer)
 * Description: Integration tests for inventory service REST API operations
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { InventoryService } from './inventory.service';
import {
  InventoryItem,
  Category,
  StockStatus,
  CreateInventoryItem,
  UpdateInventoryItem
} from '../models/inventory.model';

describe('InventoryService Integration Tests', () => {
  let service: InventoryService;
  let httpMock: HttpTestingController;
  const API_URL = 'https://prog2005.it.scu.edu.au/ArtGalley';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InventoryService]
    });

    service = TestBed.inject(InventoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAllItems', () => {
    it('should fetch all inventory items', () => {
      const mockItems: InventoryItem[] = [
        {
          itemName: 'Laptop',
          category: Category.ELECTRONICS,
          quantity: 10,
          price: 999.99,
          supplierName: 'Tech Corp',
          stockStatus: StockStatus.IN_STOCK,
          featuredItem: 1
        },
        {
          itemName: 'Chair',
          category: Category.FURNITURE,
          quantity: 5,
          price: 199.99,
          supplierName: 'Furniture Inc',
          stockStatus: StockStatus.IN_STOCK,
          featuredItem: 0
        }
      ];

      service.getAllItems().subscribe((items) => {
        expect(items).toEqual(mockItems);
        expect(items.length).toBe(2);
      });

      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe('GET');
      req.flush(mockItems);
    });

    it('should handle empty inventory', () => {
      service.getAllItems().subscribe((items) => {
        expect(items).toEqual([]);
        expect(items.length).toBe(0);
      });

      const req = httpMock.expectOne(API_URL);
      req.flush([]);
    });

    it('should handle API error', () => {
      service.getAllItems().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(API_URL);
      req.error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getItemByName', () => {
    it('should fetch a single item by name', () => {
      const mockItem: InventoryItem = {
        itemName: 'Laptop',
        category: Category.ELECTRONICS,
        quantity: 10,
        price: 999.99,
        supplierName: 'Tech Corp',
        stockStatus: StockStatus.IN_STOCK,
        featuredItem: 1
      };

      service.getItemByName('Laptop').subscribe((item) => {
        expect(item).toEqual(mockItem);
        expect(item.itemName).toBe('Laptop');
      });

      const req = httpMock.expectOne(`${API_URL}/${encodeURIComponent('Laptop')}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockItem);
    });

    it('should return 404 for non-existent item', () => {
      service.getItemByName('NonExistent').subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${API_URL}/${encodeURIComponent('NonExistent')}`);
      req.error(new ProgressEvent('error'), { status: 404, statusText: 'Not Found' });
    });

    it('should handle empty name input', () => {
      service.getItemByName('').subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Item name is required');
        }
      });
    });
  });

  describe('createItem', () => {
    it('should create a new inventory item', () => {
      const newItem: CreateInventoryItem = {
        itemName: 'New Product',
        category: 'Electronics',
        quantity: 15,
        price: 299.99,
        supplierName: 'New Supplier',
        stockStatus: 'In Stock',
        featuredItem: 0
      };

      const createdItem: InventoryItem = {
        itemName: 'New Product',
        category: Category.ELECTRONICS,
        quantity: 15,
        price: 299.99,
        supplierName: 'New Supplier',
        stockStatus: StockStatus.IN_STOCK,
        featuredItem: 0
      };

      service.createItem(newItem).subscribe((response) => {
        expect(response.success).toBe(true);
        expect(response.data).toEqual(createdItem);
      });

      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe('POST');
      req.flush(createdItem);
    });

    it('should reject invalid item data', () => {
      const invalidItem: CreateInventoryItem = {
        itemName: '',
        category: 'Electronics',
        quantity: 15,
        price: 299.99,
        supplierName: 'New Supplier'
      };

      expect(() => service.validateCreateItem(invalidItem)).toThrow();
    });
  });

  describe('updateItem', () => {
    it('should update an existing item', () => {
      const updates: UpdateInventoryItem = {
        price: 799.99,
        quantity: 20
      };

      const updatedItem: InventoryItem = {
        itemName: 'Laptop',
        category: Category.ELECTRONICS,
        quantity: 20,
        price: 799.99,
        supplierName: 'Tech Corp',
        stockStatus: StockStatus.IN_STOCK,
        featuredItem: 1
      };

      service.updateItem('Laptop', updates).subscribe((response) => {
        expect(response.success).toBe(true);
        expect(response.data?.price).toBe(799.99);
      });

      const req = httpMock.expectOne(`${API_URL}/${encodeURIComponent('Laptop')}`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedItem);
    });
  });

  describe('deleteItem', () => {
    it('should delete an item by name', () => {
      service.deleteItem('Old Product').subscribe((response) => {
        expect(response.success).toBe(true);
        expect(response.message).toContain('deleted successfully');
      });

      const req = httpMock.expectOne(`${API_URL}/${encodeURIComponent('Old Product')}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ success: true, message: 'Item deleted successfully' });
    });

    it('should block deletion of Laptop', () => {
      service.deleteItem('Laptop').subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('not allowed');
        }
      });
    });

    it('should handle 404 for non-existent item', () => {
      service.deleteItem('NonExistent').subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${API_URL}/${encodeURIComponent('NonExistent')}`);
      req.error(new ProgressEvent('error'), { status: 404, statusText: 'Not Found' });
    });
  });

  describe('searchItems', () => {
    it('should filter items by search query', () => {
      const mockItems: InventoryItem[] = [
        {
          itemName: 'Laptop Pro',
          category: Category.ELECTRONICS,
          quantity: 10,
          price: 1299.99,
          supplierName: 'Tech Corp',
          stockStatus: StockStatus.IN_STOCK,
          featuredItem: 1
        },
        {
          itemName: 'Office Chair',
          category: Category.FURNITURE,
          quantity: 5,
          price: 299.99,
          supplierName: 'Furniture Inc',
          stockStatus: StockStatus.IN_STOCK,
          featuredItem: 0
        }
      ];

      service.searchItems('Laptop').subscribe((items) => {
        expect(items.length).toBe(1);
        expect(items[0].itemName).toBe('Laptop Pro');
      });

      const req = httpMock.expectOne(API_URL);
      req.flush(mockItems);
    });

    it('should return all items for empty query', () => {
      const mockItems: InventoryItem[] = [
        {
          itemName: 'Item 1',
          category: Category.ELECTRONICS,
          quantity: 5,
          price: 99.99,
          supplierName: 'Supplier 1',
          stockStatus: StockStatus.IN_STOCK,
          featuredItem: 0
        }
      ];

      service.searchItems('').subscribe((items) => {
        expect(items.length).toBe(1);
      });

      const req = httpMock.expectOne(API_URL);
      req.flush(mockItems);
    });
  });

  describe('getFeaturedItems', () => {
    it('should return only featured items', () => {
      const mockItems: InventoryItem[] = [
        {
          itemName: 'Laptop',
          category: Category.ELECTRONICS,
          quantity: 10,
          price: 999.99,
          supplierName: 'Tech Corp',
          stockStatus: StockStatus.IN_STOCK,
          featuredItem: 1
        },
        {
          itemName: 'Chair',
          category: Category.FURNITURE,
          quantity: 5,
          price: 199.99,
          supplierName: 'Furniture Inc',
          stockStatus: StockStatus.IN_STOCK,
          featuredItem: 0
        }
      ];

      service.getFeaturedItems().subscribe((items) => {
        expect(items.length).toBe(1);
        expect(items[0].featuredItem).toBeGreaterThan(0);
      });

      const req = httpMock.expectOne(API_URL);
      req.flush(mockItems);
    });
  });
});
