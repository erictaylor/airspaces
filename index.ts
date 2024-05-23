#! /usr/bin/env bun

type Coordinate = [latitude: number, longitude: number];

const EARTH_RADIUS = 6378.137;

/**
 * Converts degrees to radians.
 * @param degrees - The degrees to convert.
 * @returns The converted radians.
 */
const degreesToRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

/**
 * Converts radians to degrees.
 * @param radians - The radians to convert.
 * @returns The converted degrees.
 */
const radiansToDegrees = (radians: number): number => {
  return (radians * 180) / Math.PI;
};

/**
 * Calculates the Haversine distance between two coordinates
 */
const haversineDistance = (pointA: Coordinate, pointB: Coordinate): number => {
  const [lat1, lon1] = pointA;
  const [lat2, lon2] = pointB;
  const earthRadiusMiles = 3958.8; // Earth's radius in miles

  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusMiles * c;
};

/**
 * Get bearing from coordinate A to coordinate B
 */
const getBearing = (pointA: Coordinate, pointB: Coordinate): number => {
  const [lat1, lon1] = pointA;
  const [lat2, lon2] = pointB;

  const dLon = degreesToRadians(lon2 - lon1);

  const y = Math.sin(dLon) * Math.cos(degreesToRadians(lat2));
  const x =
    Math.cos(degreesToRadians(lat1)) * Math.sin(degreesToRadians(lat2)) -
    Math.sin(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) * Math.cos(dLon);

  return radiansToDegrees(Math.atan2(y, x));
};

const getLatLonPoint = (
  [latitude, longitude]: Coordinate,
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
      Math.cos(initial_latitude) * Math.sin(distance / EARTH_RADIUS) * Math.cos(bearing_rad),
  );

  const final_longitude =
    initial_longitude +
    Math.atan2(
      Math.sin(bearing_rad) * Math.sin(distance / EARTH_RADIUS) * Math.cos(final_latitude),
      Math.cos(distance / EARTH_RADIUS) - Math.sin(final_latitude) * Math.sin(final_latitude),
    );

  return [radiansToDegrees(final_latitude), radiansToDegrees(final_longitude)];
};

/**
 * Find length of a side of a right triangle given the other two sides.
 */
const pythagoreanTheorem = (a: number, b: number): number => Math.sqrt(a ** 2 + b ** 2);

/**
 * Given the side lengths a, b, and c of a right triangle, find the angle A.
 */
const lawOfSines = (a: number, b: number, c: number): number => radiansToDegrees(Math.asin((a / c) * Math.sin(b)));

const solveForAngleA = (a: number, b: number, c: number): number => {
  if (a >= c || b >= c) {
    throw new Error('In a right triangle, the hypotenuse must be the longest side.');
  }

  const angleARadians = Math.asin(a / c);

  return radiansToDegrees(angleARadians);
};

/**
 * Given side lengths a and b, and angle A, find the length of side c.
 */
const lawOfCosines = (a: number, b: number, angleA: number): number =>
  Math.sqrt(a ** 2 + b ** 2 - 2 * a * b * Math.cos(degreesToRadians(angleA)));

/**
 * Converts a decimal degree value to a DMS (Degrees, Minutes, Seconds) string.
 *
 * @example decimalDegreesToDMS(37.138982, 'latitude') => `37°08'20.3"N`
 * @example decimalDegreesToDMS(-113.411846, 'longitude') => `113°24'42.7"W`
 */
const decimalDegreesToDMS = (decimalDegrees: number, direction: 'latitude' | 'longitude'): string => {
  let deg = decimalDegrees < 0 ? -decimalDegrees : decimalDegrees;
  const cardinalDirection =
    decimalDegrees < 0 ? (direction === 'latitude' ? 'S' : 'W') : direction === 'latitude' ? 'N' : 'E';

  const degrees: number = 0 | deg;
  deg += 1e-9;
  const minutes: number = 0 | ((deg % 1) * 60);
  const seconds: number = (0 | (((deg * 60) % 1) * 6_000)) / 100;

  return `${degrees.toString().padStart(3, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')} ${cardinalDirection}`;
};

const dmsToDecimalDegrees = (dms: string): number => {
  const [degrees, minutes, seconds] = dms
    .split(' ')
    // Strip non-numeric characters from each part
    .map((value) => Number.parseInt(value.replace(/\D/g, '')));
  return degrees + minutes / 60 + seconds / 3600;
};

const kilometersToNauticalMiles = (kilometers: number): number => kilometers / 1.852;

const nauticalMilesToKilometers = (nauticalMiles: number): number => nauticalMiles * 1.852;

const addDegreesToBearing = (bearing: number, degrees: number): number => {
  return (bearing + degrees + 360) % 360;
};

const subtractDegreesFromBearing = (bearing: number, degrees: number): number => {
  return (bearing - degrees + 360) % 360;
};

const main = (bearing: number, distance: number, side: number) => {
  const airport_lat_decimal = 37.036389; // 37°02'11.0"N
  const airport_lon_decimal = -113.510278; // 113°30'37.0"W

  console.log('Airport Latitude:', airport_lat_decimal);
  console.log('Airport Longitude:', airport_lon_decimal);

  const pointA = getLatLonPoint(
    [airport_lat_decimal, airport_lon_decimal],
    bearing,
    nauticalMilesToKilometers(distance),
  );

  console.log('New Point Latitude:', pointA[0]);
  console.log('New Point Longitude:', pointA[1]);

  const pointB1 = getLatLonPoint(pointA, subtractDegreesFromBearing(bearing, 90), nauticalMilesToKilometers(side));
  const pointB2 = getLatLonPoint(pointA, addDegreesToBearing(bearing, 90), nauticalMilesToKilometers(side));

  console.log(
    'Point B1:',
    pointB1.join(', '),
    [decimalDegreesToDMS(pointB1[0], 'latitude'), decimalDegreesToDMS(pointB1[1], 'longitude')].join(' '),
  );

  console.log(
    'Point B2:',
    pointB2.join(', '),
    [decimalDegreesToDMS(pointB2[0], 'latitude'), decimalDegreesToDMS(pointB2[1], 'longitude')].join(' '),
  );

  const distanceFromAirportToBPoint = pythagoreanTheorem(side, distance);
  const angleA = 90 - solveForAngleA(distance, side, distanceFromAirportToBPoint);
  const distanceFromBPointToCPoint = lawOfCosines(4.5, distanceFromAirportToBPoint, angleA);

  const pointC1 = getLatLonPoint(
    pointB1,
    addDegreesToBearing(bearing, 180),
    nauticalMilesToKilometers(distanceFromBPointToCPoint),
  );
  const pointC2 = getLatLonPoint(
    pointB2,
    addDegreesToBearing(bearing, 180),
    nauticalMilesToKilometers(distanceFromBPointToCPoint),
  );

  console.log(
    'Point C1:',
    pointC1.join(', '),
    [decimalDegreesToDMS(pointC1[0], 'latitude'), decimalDegreesToDMS(pointC1[1], 'longitude')].join(' '),
  );

  console.log(
    'Point C2:',
    pointC2.join(', '),
    [decimalDegreesToDMS(pointC2[0], 'latitude'), decimalDegreesToDMS(pointC2[1], 'longitude')].join(' '),
  );

  const bearingFromAirportToPointC1 = getBearing([airport_lat_decimal, airport_lon_decimal], pointC1);

  console.log('Bearing from Airport to Point C1:', bearingFromAirportToPointC1);

  const bearingFromAirportToPointC2 = getBearing([airport_lat_decimal, airport_lon_decimal], pointC2);

  console.log('Bearing from Airport to Point C2:', bearingFromAirportToPointC2);
};

// NE Extension
main(30, 7.7, 1);
// SW Extension
// main(203, 8.5, 2);