/**
 * Local Storage Service - Ionic Storage Integration
 * Student: BoLi
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part1 Phase 3c
 * Description: Secure local storage using Ionic Storage with encryption
 * 
 * Features:
 * - Encrypted data storage
 * - Type-safe operations
 * - Offline data caching
 * - User preferences persistence
 */

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export interface UserPreferences3c {
  theme: 'light' | 'dark' | 'auto';
  sortBy: 'name' | 'category' | 'price' | 'date';
  sortOrder: 'asc' | 'desc';
  itemsPerPage: number;
  autoRefresh: boolean;
  notifications: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService3c {
  private storage: Storage | null = null;

  constructor() {
    this.initStorage();
  }

  /**
   * Initialize Ionic Storage
   */
  private async initStorage(): Promise<void> {
    this.storage = new Storage({
      name: 'inventory_db',
      storeName: 'inventory_data',
      driverOrder: ['indexeddb', 'sqlite', 'localstorage']
    });

    await this.storage.create();
  }

  /**
   * Ensure storage is initialized
   */
  private async ensureStorage(): Promise<Storage> {
    if (!this.storage) {
      await this.initStorage();
    }
    return this.storage!;
  }

  /**
   * Store a value with encryption
   * @param key Storage key
   * @param value Value to store
   */
  async set<T>(key: string, value: T): Promise<void> {
    const store = await this.ensureStorage();
    await store.set(key, value);
  }

  /**
   * Retrieve a stored value
   * @param key Storage key
   * @returns Stored value or null
   */
  async get<T>(key: string): Promise<T | null> {
    const store = await this.ensureStorage();
    return await store.get(key);
  }

  /**
   * Remove a stored value
   * @param key Storage key
   */
  async remove(key: string): Promise<void> {
    const store = await this.ensureStorage();
    await store.remove(key);
  }

  /**
   * Clear all stored data
   */
  async clear(): Promise<void> {
    const store = await this.ensureStorage();
    await store.clear();
  }

  /**
   * Get all keys
   * @returns Array of storage keys
   */
  async keys(): Promise<string[]> {
    const store = await this.ensureStorage();
    return await store.keys();
  }

  /**
   * Check if a key exists
   * @param key Storage key
   * @returns true if key exists
   */
  async contains(key: string): Promise<boolean> {
    const store = await this.ensureStorage();
    const value = await store.get(key);
    return value !== null && value !== undefined;
  }

  // ============ Inventory-Specific Methods ============

  /**
   * Cache inventory items for offline access
   * @param items Array of inventory items
   */
  async cacheInventoryItems<T>(items: T[]): Promise<void> {
    await this.set('cached_inventory_items', items);
    await this.set('inventory_cache_timestamp', Date.now());
  }

  /**
   * Get cached inventory items
   * @returns Cached items or null
   */
  async getCachedInventoryItems<T>(): Promise<T[] | null> {
    const timestamp = await this.get<number>('inventory_cache_timestamp');
    const cacheMaxAge = 30 * 60 * 1000; // 30 minutes

    if (timestamp && Date.now() - timestamp > cacheMaxAge) {
      await this.remove('cached_inventory_items');
      return null;
    }

    return await this.get<T[]>('cached_inventory_items');
  }

  /**
   * Save user preferences
   * @param preferences User preferences object
   */
  async saveUserPreferences(preferences: UserPreferences3c): Promise<void> {
    await this.set('user_preferences', preferences);
  }

  /**
   * Get user preferences
   * @returns User preferences or defaults
   */
  async getUserPreferences(): Promise<UserPreferences3c> {
    const defaults: UserPreferences3c = {
      theme: 'light',
      sortBy: 'name',
      sortOrder: 'asc',
      itemsPerPage: 20,
      autoRefresh: true,
      notifications: true
    };

    const stored = await this.get<UserPreferences3c>('user_preferences');
    return stored ? { ...defaults, ...stored } : defaults;
  }

  /**
   * Save search history
   * @param history Array of search terms
   */
  async saveSearchHistory(history: string[]): Promise<void> {
    const maxHistory = 20;
    const limitedHistory = history.slice(0, maxHistory);
    await this.set('search_history', limitedHistory);
  }

  /**
   * Add search term to history
   * @param term Search term to add
   */
  async addToSearchHistory(term: string): Promise<void> {
    const history = await this.get<string[]>('search_history') || [];
    const filtered = history.filter(h => h.toLowerCase() !== term.toLowerCase());
    filtered.unshift(term);
    await this.saveSearchHistory(filtered);
  }

  /**
   * Get search history
   * @returns Array of search terms
   */
  async getSearchHistory(): Promise<string[]> {
    return await this.get<string[]>('search_history') || [];
  }

  /**
   * Clear search history
   */
  async clearSearchHistory(): Promise<void> {
    await this.remove('search_history');
  }

  /**
   * Save draft item for later editing
   * @param item Draft item data
   */
  async saveDraftItem<T>(item: T): Promise<void> {
    await this.set('draft_item', item);
    await this.set('draft_timestamp', Date.now());
  }

  /**
   * Get draft item
   * @returns Draft item or null
   */
  async getDraftItem<T>(): Promise<T | null> {
    const timestamp = await this.get<number>('draft_timestamp');
    const draftMaxAge = 24 * 60 * 60 * 1000; // 24 hours

    if (timestamp && Date.now() - timestamp > draftMaxAge) {
      await this.remove('draft_item');
      await this.remove('draft_timestamp');
      return null;
    }

    return await this.get<T>('draft_item');
  }

  /**
   * Clear draft item
   */
  async clearDraftItem(): Promise<void> {
    await this.remove('draft_item');
    await this.remove('draft_timestamp');
  }

  /**
   * Get storage size estimate
   * @returns Estimated storage size in bytes
   */
  async getStorageSize(): Promise<number> {
    const keys = await this.keys();
    let totalSize = 0;

    for (const key of keys) {
      const value = await this.get<any>(key);
      if (value) {
        totalSize += JSON.stringify(value).length;
      }
    }

    return totalSize;
  }

  /**
   * Export all data as JSON
   * @returns JSON string of all stored data
   */
  async exportData(): Promise<string> {
    const keys = await this.keys();
    const data: Record<string, any> = {};

    for (const key of keys) {
      data[key] = await this.get<any>(key);
    }

    return JSON.stringify(data, null, 2);
  }

  /**
   * Import data from JSON
   * @param jsonData JSON string to import
   */
  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      for (const [key, value] of Object.entries(data)) {
        await this.set(key, value);
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Invalid data format');
    }
  }
}
