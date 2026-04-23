/**
 * Inventory Error Handler
 * Student: HaozheSong
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part2a
 * Description: Centralized error handling utilities for the inventory system
 */

export class InventoryError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'InventoryError';
  }
}

export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  SERVER_ERROR = 'SERVER_ERROR',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN'
}

export function getErrorMessage(errorCode: ErrorCode): string {
  const messages: Record<ErrorCode, string> = {
    [ErrorCode.NETWORK_ERROR]: 'Unable to connect to the server. Please check your internet connection.',
    [ErrorCode.VALIDATION_ERROR]: 'The data provided is invalid. Please check your input.',
    [ErrorCode.NOT_FOUND]: 'The requested item was not found.',
    [ErrorCode.CONFLICT]: 'An item with this name already exists.',
    [ErrorCode.SERVER_ERROR]: 'The server encountered an error. Please try again later.',
    [ErrorCode.TIMEOUT]: 'The request took too long. Please try again.',
    [ErrorCode.UNKNOWN]: 'An unexpected error occurred.'
  };
  return messages[errorCode];
}
