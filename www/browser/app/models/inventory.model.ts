/**
 * Inventory Data Models and Type Definitions
 * Student: HaozheSong (ID: 24832672)
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part1 - Phase 3a (API Service Layer)
 * Description: Defines core data models, interfaces and type definitions
 *              for the inventory system, aligned with REST API requirements
 */

export enum Category {
  ELECTRONICS = 'Electronics',
  FURNITURE = 'Furniture',
  CLOTHING = 'Clothing',
  TOOLS = 'Tools',
  MISCELLANEOUS = 'Miscellaneous'
}

export enum StockStatus {
  IN_STOCK = 'In Stock',
  LOW_STOCK = 'Low Stock',
  OUT_OF_STOCK = 'Out of Stock'
}

export interface InventoryItem {
  itemId?: number;
  itemName: string;
  category: Category;
  quantity: number;
  price: number;
  supplierName: string;
  stockStatus: StockStatus;
  featuredItem: number;
  specialNote?: string;
}

export interface CreateInventoryItem {
  itemName: string;
  category: string;
  quantity: number;
  price: number;
  supplierName: string;
  stockStatus?: string;
  featuredItem?: number;
  specialNote?: string;
}

export interface UpdateInventoryItem {
  category?: string;
  quantity?: number;
  price?: number;
  supplierName?: string;
  stockStatus?: string;
  featuredItem?: number;
  specialNote?: string;
}

export interface InventorySearchResult {
  item: InventoryItem;
  found: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export const VALID_CATEGORIES = [
  'Electronics',
  'Furniture',
  'Clothing',
  'Tools',
  'Miscellaneous'
] as const;

export const VALID_STOCK_STATUSES = [
  'In Stock',
  'Low Stock',
  'Out of Stock'
] as const;

export type ValidCategory = typeof VALID_CATEGORIES[number];
export type ValidStockStatus = typeof VALID_STOCK_STATUSES[number];
