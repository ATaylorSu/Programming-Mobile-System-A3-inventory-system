/**
 * Form Validator Utility
 * Student: HaozheSong (ID: 24832672)
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part1 - Phase 3a (API Service Layer)
 * Description: Comprehensive form validation for inventory item forms
 */

import { Category, StockStatus, VALID_CATEGORIES, VALID_STOCK_STATUSES } from '../models/inventory.model';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface FullValidationResult {
  valid: boolean;
  errors: string[];
}

export class FormValidator {
  static readonly MAX_NAME_LENGTH = 100;
  static readonly MAX_PRICE = 999999.99;
  static readonly MAX_QUANTITY = 999999;
  static readonly MAX_NOTE_LENGTH = 500;
  static readonly PRICE_DECIMAL_PLACES = 2;

  /**
   * Validate item name field
   */
  static validateItemName(name: string | undefined | null): ValidationResult {
    if (!name || name.trim() === '') {
      return { valid: false, error: 'Item name is required' };
    }

    if (name.trim().length !== name.length) {
      return { valid: false, error: 'Item name cannot have leading or trailing spaces' };
    }

    if (name.length > this.MAX_NAME_LENGTH) {
      return { valid: false, error: `Item name must be ${this.MAX_NAME_LENGTH} characters or less` };
    }

    return { valid: true };
  }

  /**
   * Validate price field
   */
  static validatePrice(price: number | string | undefined | null): ValidationResult {
    if (price === undefined || price === null || price === '') {
      return { valid: false, error: 'Price is required' };
    }

    const numPrice = typeof price === 'string' ? parseFloat(price) : price;

    if (isNaN(numPrice)) {
      return { valid: false, error: 'Price must be a valid number' };
    }

    if (numPrice < 0) {
      return { valid: false, error: 'Price cannot be negative' };
    }

    if (numPrice > this.MAX_PRICE) {
      return { valid: false, error: `Price cannot exceed ${this.MAX_PRICE}` };
    }

    const priceStr = numPrice.toString();
    if (priceStr.includes('.')) {
      const decimals = priceStr.split('.')[1];
      if (decimals && decimals.length > this.PRICE_DECIMAL_PLACES) {
        return { valid: false, error: `Price can have maximum ${this.PRICE_DECIMAL_PLACES} decimal places` };
      }
    }

    return { valid: true };
  }

  /**
   * Validate quantity field
   */
  static validateQuantity(quantity: number | string | undefined | null): ValidationResult {
    if (quantity === undefined || quantity === null || quantity === '') {
      return { valid: false, error: 'Quantity is required' };
    }

    const numQuantity = typeof quantity === 'string' ? parseInt(quantity, 10) : quantity;

    if (isNaN(numQuantity)) {
      return { valid: false, error: 'Quantity must be a valid integer' };
    }

    if (!Number.isInteger(numQuantity)) {
      return { valid: false, error: 'Quantity must be an integer' };
    }

    if (numQuantity < 0) {
      return { valid: false, error: 'Quantity cannot be negative' };
    }

    if (numQuantity > this.MAX_QUANTITY) {
      return { valid: false, error: `Quantity cannot exceed ${this.MAX_QUANTITY}` };
    }

    return { valid: true };
  }

  /**
   * Validate supplier name field
   */
  static validateSupplierName(name: string | undefined | null): ValidationResult {
    if (!name || name.trim() === '') {
      return { valid: false, error: 'Supplier name is required' };
    }

    if (name.trim().length !== name.length) {
      return { valid: false, error: 'Supplier name cannot have leading or trailing spaces' };
    }

    if (name.length > this.MAX_NAME_LENGTH) {
      return { valid: false, error: `Supplier name must be ${this.MAX_NAME_LENGTH} characters or less` };
    }

    return { valid: true };
  }

  /**
   * Validate category selection
   */
  static validateCategory(category: string | undefined | null): ValidationResult {
    if (!category || category.trim() === '') {
      return { valid: false, error: 'Please select a category' };
    }

    if (!VALID_CATEGORIES.includes(category as any)) {
      return {
        valid: false,
        error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`
      };
    }

    return { valid: true };
  }

  /**
   * Validate stock status selection
   */
  static validateStockStatus(status: string | undefined | null): ValidationResult {
    if (!status || status.trim() === '') {
      return { valid: false, error: 'Please select a stock status' };
    }

    if (!VALID_STOCK_STATUSES.includes(status as any)) {
      return {
        valid: false,
        error: `Invalid stock status. Must be one of: ${VALID_STOCK_STATUSES.join(', ')}`
      };
    }

    return { valid: true };
  }

  /**
   * Validate special note field (optional)
   */
  static validateSpecialNote(note: string | undefined | null): ValidationResult {
    if (!note) {
      return { valid: true };
    }

    if (note.length > this.MAX_NOTE_LENGTH) {
      return { valid: false, error: `Special note must be ${this.MAX_NOTE_LENGTH} characters or less` };
    }

    return { valid: true };
  }

  /**
   * Validate featured item field
   */
  static validateFeaturedItem(value: number | undefined | null): ValidationResult {
    if (value === undefined || value === null) {
      return { valid: true };
    }

    if (typeof value !== 'number' || !Number.isInteger(value)) {
      return { valid: false, error: 'Featured item must be an integer (0 or 1)' };
    }

    if (value < 0 || value > 1) {
      return { valid: false, error: 'Featured item must be 0 (not featured) or 1 (featured)' };
    }

    return { valid: true };
  }

  /**
   * Validate all fields for create item form
   */
  static validateCreateItem(
    itemName: string | undefined | null,
    category: string | undefined | null,
    quantity: number | string | undefined | null,
    price: number | string | undefined | null,
    supplierName: string | undefined | null,
    stockStatus?: string | undefined | null,
    specialNote?: string | undefined | null,
    featuredItem?: number | undefined | null
  ): FullValidationResult {
    const errors: string[] = [];

    const nameResult = this.validateItemName(itemName);
    if (!nameResult.valid) errors.push(nameResult.error!);

    const categoryResult = this.validateCategory(category);
    if (!categoryResult.valid) errors.push(categoryResult.error!);

    const quantityResult = this.validateQuantity(quantity);
    if (!quantityResult.valid) errors.push(quantityResult.error!);

    const priceResult = this.validatePrice(price);
    if (!priceResult.valid) errors.push(priceResult.error!);

    const supplierResult = this.validateSupplierName(supplierName);
    if (!supplierResult.valid) errors.push(supplierResult.error!);

    if (stockStatus !== undefined && stockStatus !== null) {
      const statusResult = this.validateStockStatus(stockStatus);
      if (!statusResult.valid) errors.push(statusResult.error!);
    }

    if (specialNote !== undefined && specialNote !== null) {
      const noteResult = this.validateSpecialNote(specialNote);
      if (!noteResult.valid) errors.push(noteResult.error!);
    }

    if (featuredItem !== undefined && featuredItem !== null) {
      const featuredResult = this.validateFeaturedItem(featuredItem);
      if (!featuredResult.valid) errors.push(featuredResult.error!);
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Validate all fields for update item form (all fields optional)
   */
  static validateUpdateItem(
    category?: string | undefined | null,
    quantity?: number | string | undefined | null,
    price?: number | string | undefined | null,
    supplierName?: string | undefined | null,
    stockStatus?: string | undefined | null,
    specialNote?: string | undefined | null,
    featuredItem?: number | undefined | null
  ): FullValidationResult {
    const errors: string[] = [];

    if (category !== undefined && category !== null) {
      const categoryResult = this.validateCategory(category);
      if (!categoryResult.valid) errors.push(categoryResult.error!);
    }

    if (quantity !== undefined && quantity !== null) {
      const quantityResult = this.validateQuantity(quantity);
      if (!quantityResult.valid) errors.push(quantityResult.error!);
    }

    if (price !== undefined && price !== null) {
      const priceResult = this.validatePrice(price);
      if (!priceResult.valid) errors.push(priceResult.error!);
    }

    if (supplierName !== undefined && supplierName !== null) {
      const supplierResult = this.validateSupplierName(supplierName);
      if (!supplierResult.valid) errors.push(supplierResult.error!);
    }

    if (stockStatus !== undefined && stockStatus !== null) {
      const statusResult = this.validateStockStatus(stockStatus);
      if (!statusResult.valid) errors.push(statusResult.error!);
    }

    if (specialNote !== undefined && specialNote !== null) {
      const noteResult = this.validateSpecialNote(specialNote);
      if (!noteResult.valid) errors.push(noteResult.error!);
    }

    if (featuredItem !== undefined && featuredItem !== null) {
      const featuredResult = this.validateFeaturedItem(featuredItem);
      if (!featuredResult.valid) errors.push(featuredResult.error!);
    }

    return { valid: errors.length === 0, errors };
  }
}
