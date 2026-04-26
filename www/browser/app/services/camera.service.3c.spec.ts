/**
 * Camera Service Tests
 * Student: BoLi
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part1 Phase 3c
 * Description: Unit tests for CameraService3c
 */

import { TestBed } from '@angular/core/testing';
import { CameraService3c } from './camera.service.3c';

describe('CameraService3c', () => {
  let service: CameraService3c;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CameraService3c);
  });

  describe('Image Data URL Generation', () => {
    it('should generate valid data URL from base64', () => {
      const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const dataUrl = service.getImageDataUrl(base64);

      expect(dataUrl).toContain('data:image/jpeg;base64,');
      expect(dataUrl).toContain(base64);
    });

    it('should handle empty base64 string', () => {
      const dataUrl = service.getImageDataUrl('');
      
      expect(dataUrl).toContain('data:image/jpeg;base64,');
      expect(dataUrl).toBe('data:image/jpeg;base64,');
    });
  });

  describe('Base64 Image Validation', () => {
    it('should validate correct base64 image', () => {
      const validBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      
      expect(service.isValidBase64Image(validBase64)).toBe(true);
    });

    it('should reject very short strings', () => {
      expect(service.isValidBase64Image('abc')).toBe(false);
    });

    it('should reject empty strings', () => {
      expect(service.isValidBase64Image('')).toBe(false);
    });

    it('should reject null', () => {
      expect(service.isValidBase64Image(null as any)).toBe(false);
    });
  });

  describe('Service Configuration', () => {
    it('should have correct default quality', () => {
      expect((service as any).DEFAULT_QUALITY).toBe(90);
    });

    it('should have correct max dimensions', () => {
      expect((service as any).MAX_WIDTH).toBe(1024);
      expect((service as any).MAX_HEIGHT).toBe(1024);
    });
  });
});
