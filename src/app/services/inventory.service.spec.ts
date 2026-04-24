/**
 * API Integration Test Suite
 * Student: BoLi
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part2b
 * Description: Comprehensive tests for the inventory API integration
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InventoryService } from './inventory.service';
import { InventoryItem, Category } from '../models/inventory.model';

describe('InventoryService API Integration Tests', () => {
  let service: InventoryService;
  let httpMock: HttpTestingController;
  const API_BASE_URL = 'https://prog2005.it.scu.edu.au/ArtGalley';

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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllItems', () => {
    it('should return all inventory items', () => {
      const mockItems: InventoryItem[] = [
        {
          name: 'Test Item',
          price: 99.99,
          description: 'Test description',
          category: Category.ELECTRONICS,
          featured: true
        }
      ];

      service.getAllItems().subscribe((items) => {
        expect(items).toEqual(mockItems);
      });

      const req = httpMock.expectOne(API_BASE_URL);
      expect(req.request.method).toBe('GET');
      req.flush(mockItems);
    });
  });

  describe('createItem', () => {
    it('should create a new inventory item', () => {
      const newItem = {
        name: 'New Item',
        price: 49.99,
        description: 'New description',
        category: 'Electronics'
      };

      service.createItem(newItem).subscribe((item) => {
        expect(item.name).toBe(newItem.name);
      });

      const req = httpMock.expectOne(API_BASE_URL);
      expect(req.request.method).toBe('POST');
      req.flush({ ...newItem, featured: false });
    });
  });

  describe('deleteItem', () => {
    it('should delete an inventory item', () => {
      const itemName = 'Test Item';

      service.deleteItem(itemName).subscribe((response) => {
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne(`${API_BASE_URL}/${encodeURIComponent(itemName)}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ success: true });
    });
  });
});
