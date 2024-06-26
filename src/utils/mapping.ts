import { EARTH_RADIUS, NAUTICAL_MILES_TO_KILOMETERS } from '../constants.ts';
import type { CardinalDirection, Coordinate } from '../types.ts';

/**
 * Converts degrees to radians.
 * @param degrees - The degrees to convert.
 * @returns The converted radians.
 */
export const degreesToRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

/**
 * Converts radians to degrees.
 * @param radians - The radians to convert.
 * @returns The converted degrees.
 */
export const radiansToDegrees = (radians: number): number => {
  return (radians * 180) / Math.PI;
};

/**
 * Get bearing from coordinate A to coordinate B
 */
export const getBearing = (pointA: Coordinate, pointB: Coordinate): number => {
  const [lat1, lon1] = pointA;
  const [lat2, lon2] = pointB;

  const dLon = degreesToRadians(lon2 - lon1);

  const y = Math.sin(dLon) * Math.cos(degreesToRadians(lat2));
  const x =
    Math.cos(degreesToRadians(lat1)) * Math.sin(degreesToRadians(lat2)) -
    Math.sin(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.cos(dLon);

  return (radiansToDegrees(Math.atan2(y, x)) + 360) % 360;
};

/**
 * Retrieves a new Coordinate point given a starting
 * Coordinate point, bearing, and distance.
 *
 * @param coordinate - The starting Coordinate point.
 * @param bearing - The bearing in degrees.
 * @param distance - The distance in kilometers.
 *
 * @returns The new Coordinate point.
 */
export const getLatLonPoint = (
  [latitude, longitude]: Coordinate,
  /**
   * Bearing in degrees.
   * 0 - 360 degrees. Clockwise from North.
   */
  bearing: number,
  /**
   * Distance in kilometers
   */
  distance: number,
): Coordinate => {
  const bearing_rad = (bearing * Math.PI) / 180;

  const initial_latitude = (latitude * Math.PI) / 180;
  const initial_longitude = (longitude * Math.PI) / 180;

  const final_latitude = Math.asin(
    Math.sin(initial_latitude) * Math.cos(distance / EARTH_RADIUS) +
      Math.cos(initial_latitude) *
        Math.sin(distance / EARTH_RADIUS) *
        Math.cos(bearing_rad),
  );

  const final_longitude =
    initial_longitude +
    Math.atan2(
      Math.sin(bearing_rad) *
        Math.sin(distance / EARTH_RADIUS) *
        Math.cos(final_latitude),
      Math.cos(distance / EARTH_RADIUS) -
        Math.sin(final_latitude) * Math.sin(final_latitude),
    );

  return [radiansToDegrees(final_latitude), radiansToDegrees(final_longitude)];
};

/**
 * Find the Coordinates of a point between two Coordinate points.
 *
 * @param pointA - The first Coordinate point.
 * @param pointB - The second Coordinate point.
 *
 * @returns The Coordinate point that is the midpoint between pointA and pointB.
 */
export const getMidpoint = (
  pointA: Coordinate,
  pointB: Coordinate,
): Coordinate => {
  const [lat1, lon1] = pointA;
  const [lat2, lon2] = pointB;

  const dLon = degreesToRadians(lon2 - lon1);

  const lat1Rad = degreesToRadians(lat1);
  const lat2Rad = degreesToRadians(lat2);

  const Bx = Math.cos(lat2Rad) * Math.cos(dLon);
  const By = Math.cos(lat2Rad) * Math.sin(dLon);

  const lat3 = radiansToDegrees(
    Math.atan2(
      Math.sin(lat1Rad) + Math.sin(lat2Rad),
      Math.sqrt((Math.cos(lat1Rad) + Bx) ** 2 + By ** 2),
    ),
  );

  const lon3 = radiansToDegrees(
    degreesToRadians(lon1) + Math.atan2(By, Math.cos(lat1Rad) + Bx),
  );

  return [lat3, lon3];
};

/**
 * Find the distance between two Coordinate points in nautical miles.
 *
 * @param pointA - The first Coordinate point.
 * @param pointB - The second Coordinate point.
 *
 * @returns The distance between the two Coordinate points in nautical miles.
 */
export const getDistanceBetweenPoints = (
  pointA: Coordinate,
  pointB: Coordinate,
): number => {
  throw new Error('Not implemented');
};

/**
 * Given a pair of Coordinate points, return the Coordinate point
 * that intersects the line at a given latitude.
 *
 * @param pointA - The first Coordinate point.
 * @param pointB - The second Coordinate point.
 * @param latitude - The latitude at which to find the intersection point.
 *
 * @returns The Coordinate point that intersects the line at the given latitude.
 */
export const getIntersectionPointAtLatitude = (
  pointA: Coordinate,
  pointB: Coordinate,
  latitude: number,
): Coordinate | null => {
  const [lat1, lon1] = pointA;
  const [lat2, lon2] = pointB;

  const m = (lat2 - lat1) / (lon2 - lon1);
  const b = lat1 - m * lon1;

  const x = (latitude - b) / m;

  if (x < Math.min(lon1, lon2) || x > Math.max(lon1, lon2) || Number.isNaN(x)) {
    return null;
  }

  return [latitude, x];
};

/**
 * Given a pair of Coordinate points, return the Coordinate point
 * that intersects the line at a given longitude.
 *
 * @param pointA - The first Coordinate point.
 * @param pointB - The second Coordinate point.
 * @param longitude - The longitude at which to find the intersection point.
 *
 * @returns The Coordinate point that intersects the line at the given longitude.
 */
export const getIntersectionPointAtLongitude = (
  pointA: Coordinate,
  pointB: Coordinate,
  longitude: number,
): Coordinate | null => {
  const [lat1, lon1] = pointA;
  const [lat2, lon2] = pointB;

  const m = (lat2 - lat1) / (lon2 - lon1);
  const b = lat1 - m * lon1;

  const y = m * longitude + b;

  if (y < Math.min(lat1, lat2) || y > Math.max(lat1, lat2) || Number.isNaN(y)) {
    return null;
  }

  return [y, longitude];
};

/**
 * Find length of a side of a right triangle given the other two sides.
 *
 * @param a - The length of side a.
 * @param b - The length of side b.
 *
 * @returns The length of side c.
 */
export const pythagoreanTheorem = (a: number, b: number): number =>
  Math.sqrt(a ** 2 + b ** 2);

/**
 * Given the side lengths a, b, and c of a right triangle,
 * finds the angle A.
 *
 * @param a - The length of side a.
 * @param b - The length of side b.
 * @param c - The length of side c.
 *
 * @returns The angle A in degrees.
 */
export const lawOfSines = (a: number, b: number, c: number): number =>
  radiansToDegrees(Math.asin((a / c) * Math.sin(b)));

/**
 * Given side lengths a and b, and angle A, find the length of side c.
 *
 * @param a - The length of side a.
 * @param b - The length of side b.
 * @param angleA - The angle A in degrees.
 *
 * @returns The length of side c.
 */
export const lawOfCosines = (a: number, b: number, angleA: number): number =>
  Math.sqrt(a ** 2 + b ** 2 - 2 * a * b * Math.cos(degreesToRadians(angleA)));

/**
 * Given the side lengths a, b, and c of a right triangle,
 * finds the angle A.
 *
 * @param a - The length of side a.
 * @param b - The length of side b.
 * @param c - The length of side c.
 *
 * @returns The angle A in degrees.
 */
export const solveForAngleA = (a: number, b: number, c: number): number => {
  if (a >= c || b >= c) {
    throw new Error(
      'In a right triangle, the hypotenuse must be the longest side.',
    );
  }

  const angleARadians = Math.asin(a / c);

  return radiansToDegrees(angleARadians);
};

/**
 * Converts a decimal degree value to a DMS (Degrees, Minutes, Seconds) object.
 *
 * @param decimalDegrees - The decimal degree value.
 *
 * @returns The DMS object.
 */
const calculateDMS = (
  decimalDegrees: number,
): { degrees: string; minutes: string; seconds: string } => {
  const absolute = Math.abs(decimalDegrees);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);

  return { degrees: degrees.toString(), minutes: minutes.toString(), seconds };
};

/**
 * Given a decimal degree value and a direction, returns the cardinal direction.
 *
 * @param decimalDegrees - The decimal degree value.
 * @param direction - The direction of the coordinate.
 *
 * @returns The cardinal direction.
 */
export const getCardinalDirection = (
  decimalDegrees: number,
  direction: 'latitude' | 'longitude',
): CardinalDirection => {
  if (direction === 'latitude') {
    return decimalDegrees < 0 ? 'S' : 'N';
  }

  return decimalDegrees < 0 ? 'W' : 'E';
};

/**
 * Converts a decimal degree value to a DMS (Degrees, Minutes, Seconds) string.
 *
 * @param decimalDegrees - The decimal degree value to convert.
 * @param direction - The direction of the coordinate.
 *
 * @returns The DMS string.
 *
 * @example decimalDegreesToDMS(37.138982, 'latitude') => `37°08'20.3"N`
 * @example decimalDegreesToDMS(-113.411846, 'longitude') => `113°24'42.7"W`
 */
export const decimalDegreesToDMS = (
  decimalDegrees: number,
  direction: 'latitude' | 'longitude',
): string => {
  const cardinalDirection = getCardinalDirection(decimalDegrees, direction);
  const { degrees, minutes, seconds } = calculateDMS(decimalDegrees);

  return `${degrees.padStart(3, '0')}°${minutes.padStart(
    2,
    '0',
  )}'${seconds.padStart(2, '0')}"${cardinalDirection}`;
};

/**
 * Converts a decimal degree value to a OpenAIR formatted DMS string.
 *
 * @param decimalDegrees - The decimal degree value to convert.
 * @param direction - The direction of the coordinate.
 *
 * @returns The OpenAIR formatted DMS string.
 *
 * @example decimalDegreesToOpenAir(37.138982, 'latitude') => '037:08:20.3 N'
 * @example decimalDegreesToOpenAir(-113.411846, 'longitude') => '113:24:42.7 W'
 */
export const decimalDegreesToOpenAir = (
  decimalDegrees: number,
  direction: 'latitude' | 'longitude',
): string => {
  const cardinalDirection = getCardinalDirection(decimalDegrees, direction);
  const { degrees, minutes, seconds } = calculateDMS(decimalDegrees);

  return [
    [
      degrees.padStart(3, '0'),
      minutes.padStart(2, '0'),
      Number.parseFloat(seconds).toFixed(2).padStart(5, '0'),
    ].join(':'),
    cardinalDirection,
  ].join(' ');
};

/**
 * Does the inverse of decimalDegreesToOpenAir and converts an OpenAIR formatted DMS string to a decimal degree value.
 *
 * @example openAirToDecimalDegrees('037:01:23.80 N') => 37.023278
 * @example openAirToDecimalDegrees('113:29:07.50 W') => -113.485417
 */
export const openAirToDecimalDegrees = (openAir: string): number => {
  const [degrees, minutes, rest] = openAir.split(':');
  const [seconds, direction] = rest.split(' ');

  const decimalDegrees =
    (Number(degrees) +
      Number(minutes) / 60 +
      Number.parseFloat(seconds) / 3600) *
    (direction === 'N' || direction === 'E' ? 1 : -1);

  return Number.parseFloat(decimalDegrees.toFixed(6));
};

/**
 * Converts kilometers to nautical miles.
 *
 * @param kilometers - The kilometers to convert.
 *
 * @returns The converted nautical miles.
 */
export const kilometersToNauticalMiles = (kilometers: number): number =>
  kilometers / NAUTICAL_MILES_TO_KILOMETERS;

/**
 * Converts nautical miles to kilometers.
 *
 * @param nauticalMiles - The nautical miles to convert.
 *
 * @returns The converted kilometers.
 */
export const nauticalMilesToKilometers = (nauticalMiles: number): number =>
  nauticalMiles * NAUTICAL_MILES_TO_KILOMETERS;

/**
 * Adds degrees to a bearing.
 *
 * @param bearing - The bearing in degrees.
 * @param degrees - The degrees to add.
 *
 * @returns The new bearing.
 */
export const addDegreesToBearing = (
  bearing: number,
  degrees: number,
): number => {
  return (bearing + degrees + 360) % 360;
};

/**
 * Subtracts degrees from a bearing.
 *
 * @param bearing - The bearing in degrees.
 * @param degrees - The degrees to subtract.
 *
 * @returns The new bearing.
 */
export const subtractDegreesFromBearing = (
  bearing: number,
  degrees: number,
): number => {
  return (bearing - degrees + 360) % 360;
};

export const coordinateToOpenAir = (coordinate: Coordinate): string => {
  return [
    decimalDegreesToOpenAir(coordinate[0], 'latitude'),
    decimalDegreesToOpenAir(coordinate[1], 'longitude'),
  ].join(' ');
};
