/**
 * Inventory Data Models and Type Definitions
 * Student: HaozheSong
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part2a
 * Description: Defines core data models, interfaces and type definitions for the inventory system
 */

export interface InventoryItem {
  name: string;
  price: number;
  description: string;
  category: Category;
  featured: boolean;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum Category {
  ELECTRONICS = 'Electronics',
  FURNITURE = 'Furniture',
  CLOTHING = 'Clothing',
  BOOKS = 'Books',
  FOOD = 'Food',
  OTHER = 'Other'
}

export interface CreateInventoryItem {
  name: string;
  price: number;
  description: string;
  category: string;
  featured?: boolean;
}

export interface UpdateInventoryItem {
  price?: number;
  description?: string;
  category?: string;
  featured?: boolean;
}

export interface InventorySearchResult {
  items: InventoryItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
