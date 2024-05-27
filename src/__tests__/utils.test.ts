import { describe, expect, it } from 'bun:test';
import type { CardinalDirection } from '../types';
import {
  addDegreesToBearing,
  getCardinalDirection,
  kilometersToNauticalMiles,
  nauticalMilesToKilometers,
  subtractDegreesFromBearing,
} from '../utils';

describe('utils', () => {
  describe('addDegreesToBearing', () => {
    it.each([
      [90, 0, 90],
      [-90, 0, 270],
      [61, 300, 1],
      [60, 300, 0],
    ])('should add %p to bearing %p', (degrees, bearing, expected) => {
      expect(addDegreesToBearing(bearing, degrees)).toBe(expected);
    });
  });

  describe('subtractDegreesFromBearing', () => {
    it.each([
      [90, 180, 90],
      [90, 0, 270],
      [61, 60, 359],
      [60, 60, 0],
    ])('should subtract %p from bearing %p', (degrees, bearing, expected) => {
      expect(subtractDegreesFromBearing(bearing, degrees)).toBe(expected);
    });
  });

  describe('getCardinalDirection', () => {
    it.each<[number, 'latitude' | 'longitude', CardinalDirection]>([
      [1, 'latitude', 'N'],
      [1, 'longitude', 'E'],
      [-1, 'latitude', 'S'],
      [-1, 'longitude', 'W'],
      [0, 'latitude', 'N'],
      [0, 'longitude', 'E'],
    ])(
      'should return the cardinal direction for degrees %p %p',
      (degrees, direction, expected) => {
        expect(getCardinalDirection(degrees, direction)).toBe(expected);
      },
    );
  });

  describe('kilometersToNauticalMiles', () => {
    it('should convert kilometers to nautical miles', () => {
      expect(kilometersToNauticalMiles(1).toFixed(8)).toBe('0.53995680');
    });
  });

  describe('nauticalMilesToKilometers', () => {
    it('should convert nautical miles to kilometers', () => {
      expect(nauticalMilesToKilometers(1)).toBe(1.852);
    });
  });
});
