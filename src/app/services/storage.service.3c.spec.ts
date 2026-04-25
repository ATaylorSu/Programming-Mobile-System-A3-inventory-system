/**
 * Storage Service Tests
 * Student: BoLi
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part1 Phase 3c
 * Description: Unit tests for StorageService3c
 */

import { TestBed } from '@angular/core/testing';
import { StorageService3c, UserPreferences3c } from './storage.service.3c';

describe('StorageService3c', () => {
  let service: StorageService3c;

  beforeEach(async () => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService3c);
    await service.clear();
  });

  afterEach(async () => {
    await service.clear();
  });

  describe('Basic Operations', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should set and get a value', async () => {
      await service.set('testKey', 'testValue');
      const value = await service.get<string>('testKey');
      expect(value).toBe('testValue');
    });

    it('should return null for non-existent key', async () => {
      const value = await service.get<string>('nonExistent');
      expect(value).toBeNull();
    });

    it('should remove a value', async () => {
      await service.set('removeKey', 'value');
      await service.remove('removeKey');
      const value = await service.get<string>('removeKey');
      expect(value).toBeNull();
    });

    it('should check if key exists', async () => {
      await service.set('existsKey', 'value');
      const exists = await service.contains('existsKey');
      expect(exists).toBe(true);
    });

    it('should clear all data', async () => {
      await service.set('key1', 'value1');
      await service.set('key2', 'value2');
      await service.clear();
      const keys = await service.keys();
      expect(keys.length).toBe(0);
    });
  });

  describe('User Preferences', () => {
    it('should save and retrieve user preferences', async () => {
      const preferences: UserPreferences3c = {
        theme: 'dark',
        sortBy: 'price',
        sortOrder: 'desc',
        itemsPerPage: 50,
        autoRefresh: false,
        notifications: true
      };

      await service.saveUserPreferences(preferences);
      const retrieved = await service.getUserPreferences();

      expect(retrieved.theme).toBe('dark');
      expect(retrieved.sortBy).toBe('price');
      expect(retrieved.sortOrder).toBe('desc');
      expect(retrieved.itemsPerPage).toBe(50);
      expect(retrieved.autoRefresh).toBe(false);
      expect(retrieved.notifications).toBe(true);
    });

    it('should return default preferences when none set', async () => {
      const defaults = await service.getUserPreferences();

      expect(defaults.theme).toBe('light');
      expect(defaults.sortBy).toBe('name');
      expect(defaults.itemsPerPage).toBe(20);
    });
  });

  describe('Search History', () => {
    it('should add search terms to history', async () => {
      await service.addToSearchHistory('laptop');
      await service.addToSearchHistory('phone');
      const history = await service.getSearchHistory();

      expect(history).toContain('laptop');
      expect(history).toContain('phone');
    });

    it('should not duplicate search terms', async () => {
      await service.addToSearchHistory('laptop');
      await service.addToSearchHistory('laptop');
      const history = await service.getSearchHistory();

      const laptopCount = history.filter(t => t === 'laptop').length;
      expect(laptopCount).toBe(1);
    });

    it('should limit history to 20 items', async () => {
      for (let i = 0; i < 25; i++) {
        await service.addToSearchHistory(`term${i}`);
      }
      const history = await service.getSearchHistory();

      expect(history.length).toBeLessThanOrEqual(20);
    });

    it('should clear search history', async () => {
      await service.addToSearchHistory('test');
      await service.clearSearchHistory();
      const history = await service.getSearchHistory();

      expect(history.length).toBe(0);
    });
  });

  describe('Inventory Caching', () => {
    it('should cache inventory items', async () => {
      const items = [
        { name: 'Item 1', price: 100 },
        { name: 'Item 2', price: 200 }
      ];

      await service.cacheInventoryItems(items);
      const cached = await service.getCachedInventoryItems<any>();

      expect(cached).toEqual(items);
    });

    it('should return null for expired cache', async () => {
      const items = [{ name: 'Test' }];
      await service.cacheInventoryItems(items);

      const originalDateNow = Date.now.bind(Date);
      Date.now = () => originalDateNow() + 60 * 60 * 1000;

      const cached = await service.getCachedInventoryItems<any>();
      expect(cached).toBeNull();

      Date.now = originalDateNow;
    });
  });

  describe('Draft Items', () => {
    it('should save and retrieve draft item', async () => {
      const draft = { name: 'Draft Item', price: 99 };
      await service.saveDraftItem(draft);
      const retrieved = await service.getDraftItem<any>();

      expect(retrieved).toEqual(draft);
    });

    it('should clear draft item', async () => {
      await service.saveDraftItem({ name: 'Test' });
      await service.clearDraftItem();
      const draft = await service.getDraftItem<any>();

      expect(draft).toBeNull();
    });
  });
});
