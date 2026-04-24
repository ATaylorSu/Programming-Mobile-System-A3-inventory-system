/**
 * Bug Fix: Form Validation Edge Cases
 * Student: BoLi
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part2b
 * Description: Improved validation for edge cases in inventory forms
 *
 * Edge cases handled:
 * - Empty strings trimmed before validation
 * - Price with more than 2 decimal places
 * - Maximum name length enforcement
 * - Category selection required
 */

export class FormValidator {
  static readonly MAX_NAME_LENGTH = 100;
  static readonly MAX_PRICE = 999999.99;
  static readonly PRICE_DECIMAL_PLACES = 2;

  /**
   * Validate item name
   */
  static validateName(name: string): { valid: boolean; error?: string } {
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
   * Validate price value
   */
  static validatePrice(price: number | string): { valid: boolean; error?: string } {
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

    // Check decimal places
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
   * Validate category selection
   */
  static validateCategory(category: string): { valid: boolean; error?: string } {
    const validCategories = [
      'Electronics', 'Furniture', 'Clothing', 'Books', 'Food', 'Other'
    ];

    if (!category || category.trim() === '') {
      return { valid: false, error: 'Please select a category' };
    }

    if (!validCategories.includes(category)) {
      return { valid: false, error: 'Invalid category selected' };
    }

    return { valid: true };
  }

  /**
   * Validate all fields at once
   */
  static validateItem(name: string, price: number, category: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    const nameResult = this.validateName(name);
    if (!nameResult.valid) errors.push(nameResult.error!);

    const priceResult = this.validatePrice(price);
    if (!priceResult.valid) errors.push(priceResult.error!);

    const categoryResult = this.validateCategory(category);
    if (!categoryResult.valid) errors.push(categoryResult.error!);

    return { valid: errors.length === 0, errors };
  }
}
