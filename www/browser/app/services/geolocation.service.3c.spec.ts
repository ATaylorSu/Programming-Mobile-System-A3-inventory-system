/**
 * Geolocation Service Tests
 * Student: BoLi
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part1 Phase 3c
 * Description: Unit tests for GeolocationService3c
 */

import { TestBed } from '@angular/core/testing';
import { GeolocationService3c } from './geolocation.service.3c';

describe('GeolocationService3c', () => {
  let service: GeolocationService3c;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeolocationService3c);
  });

  describe('Distance Calculation', () => {
    it('should calculate distance between two points correctly', () => {
      const lat1 = 40.7128;
      const lon1 = -74.0060;
      const lat2 = 34.0522;
      const lon2 = -118.2437;

      const distance = service.calculateDistance(lat1, lon1, lat2, lon2);
      
      expect(distance).toBeGreaterThan(3900);
      expect(distance).toBeLessThan(4000);
    });

    it('should return 0 for same location', () => {
      const lat = 40.7128;
      const lon = -74.0060;

      const distance = service.calculateDistance(lat, lon, lat, lon);
      
      expect(distance).toBe(0);
    });

    it('should calculate short distances accurately', () => {
      const lat1 = 40.7128;
      const lon1 = -74.0060;
      const lat2 = 40.7228;
      const lon2 = -74.0060;

      const distance = service.calculateDistance(lat1, lon1, lat2, lon2);
      
      expect(distance).toBeGreaterThan(1);
      expect(distance).toBeLessThan(2);
    });
  });

  describe('Coordinate Formatting', () => {
    it('should format positive coordinates correctly', () => {
      const formatted = service.formatCoordinates(40.712800, 74.006000);
      
      expect(formatted).toContain('40.712800');
      expect(formatted).toContain('N');
      expect(formatted).toContain('74.006000');
      expect(formatted).toContain('E');
    });

    it('should format negative coordinates correctly', () => {
      const formatted = service.formatCoordinates(-33.868800, -151.209300);
      
      expect(formatted).toContain('33.868800');
      expect(formatted).toContain('S');
      expect(formatted).toContain('151.209300');
      expect(formatted).toContain('W');
    });
  });

  describe('Distance Formatting', () => {
    it('should format distances less than 1km in meters', () => {
      const formatted = service.formatDistance(0.5);
      
      expect(formatted).toContain('500');
      expect(formatted).toContain('m');
    });

    it('should format distances greater than 1km in kilometers', () => {
      const formatted = service.formatDistance(2.5);
      
      expect(formatted).toContain('2.50');
      expect(formatted).toContain('km');
    });

    it('should format 0 meters correctly', () => {
      const formatted = service.formatDistance(0);
      
      expect(formatted).toContain('0');
      expect(formatted).toContain('m');
    });
  });
});
