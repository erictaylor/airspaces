import { SGU_AIRPORT_COORDINATES } from '../constants.ts';
import type { Airspace } from '../types.ts';
import {
  buildAirspace,
  buildComment,
  buildHeader,
} from '../utils/build-airspace.ts';
import {
  addDegreesToBearing,
  getBearing,
  getLatLonPoint,
  lawOfCosines,
  nauticalMilesToKilometers,
  pythagoreanTheorem,
  solveForAngleA,
  subtractDegreesFromBearing,
} from '../utils/mapping.ts';

type ExtensionArgs = [bearing: number, distance: number, side: number];

export const RADIUS = 4.5;
export const NE_EXTENSION: ExtensionArgs = [30, 7.7, 1];
export const SW_EXTENSION: ExtensionArgs = [203, 8.5, 2];
const CEILING = 17999;
const FLOOR = 'SFC';

export const getInstruction = (radius: number): Airspace => {
  return buildAirspace(
    {
      airspaceClass: 'E',
      name: 'Saint George Class E2',
      ceiling: CEILING,
      floor: FLOOR,
    },
    [
      ['V', { variable: 'X', value: SGU_AIRPORT_COORDINATES }],
      ['DC', radius],
    ],
  );
};

export const getExtensionInstructions = (
  bearing: number,
  distance: number,
  side: number,
): Airspace => {
  const pointY = getLatLonPoint(
    SGU_AIRPORT_COORDINATES,
    bearing,
    nauticalMilesToKilometers(distance),
  );

  const pointA = getLatLonPoint(
    pointY,
    subtractDegreesFromBearing(bearing, 90),
    nauticalMilesToKilometers(side),
  );
  const pointB = getLatLonPoint(
    pointY,
    addDegreesToBearing(bearing, 90),
    nauticalMilesToKilometers(side),
  );

  const distanceFromAirportToBPoint = pythagoreanTheorem(side, distance);
  const angleA =
    90 - solveForAngleA(distance, side, distanceFromAirportToBPoint);
  const distanceFromBPointToCPoint = lawOfCosines(
    RADIUS,
    distanceFromAirportToBPoint,
    angleA,
  );

  const pointC = getLatLonPoint(
    pointA,
    addDegreesToBearing(bearing, 180),
    nauticalMilesToKilometers(distanceFromBPointToCPoint),
  );
  const pointD = getLatLonPoint(
    pointB,
    addDegreesToBearing(bearing, 180),
    nauticalMilesToKilometers(distanceFromBPointToCPoint),
  );

  const bearingFromAirportToPointC = getBearing(
    SGU_AIRPORT_COORDINATES,
    pointC,
  );
  const bearingFromAirportToPointD = getBearing(
    SGU_AIRPORT_COORDINATES,
    pointD,
  );

  return buildAirspace(
    {
      airspaceClass: 'E',
      name: `Saint George E4 ${bearing > 0 && bearing < 90 ? 'NE' : 'SW'}`,
      ceiling: CEILING,
      floor: FLOOR,
    },
    [
      ['DP', pointB],
      ['DP', pointA],
      ['V', { variable: 'X', value: SGU_AIRPORT_COORDINATES }],
      [
        'DA',
        {
          radius: RADIUS,
          angleStart: bearingFromAirportToPointC,
          angleEnd: bearingFromAirportToPointD,
        },
      ],
    ],
  );
};

export const main = (): Airspace => {
  return [
    buildHeader(`Last Generated: ${new Date().toISOString()}
See: https://www.federalregister.gov/documents/2017/08/03/2017-16282/establishment-of-class-e-airspace-and-amendment-of-class-e-airspace-st-george-ut`),
    buildComment('St. George Regional Airport Class E2 Airspace'),
    getInstruction(RADIUS).join('\n'),
    '',
    '* St. George Regional Airport Class E4 Airspace - Northeast Segment',
    getExtensionInstructions(...NE_EXTENSION).join('\n'),
    '',
    '* St. George Regional Airport Class E4 Airspace - Southwest Segment',
    getExtensionInstructions(...SW_EXTENSION).join('\n'),
    '',
  ];
};
