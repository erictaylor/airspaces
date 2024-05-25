import { SGU_AIRPORT_COORDINATES } from '../constants';
import {
  addDegreesToBearing,
  coordinateToOpenAir,
  getBearing,
  getLatLonPoint,
  lawOfCosines,
  nauticalMilesToKilometers,
  pythagoreanTheorem,
  solveForAngleA,
  subtractDegreesFromBearing,
} from '../utils';

type ExtensionArgs = [bearing: number, distance: number, side: number];

const RADIUS = 4.5;
const NE_EXTENSION: ExtensionArgs = [30, 7.7, 1];
const SW_EXTENSION: ExtensionArgs = [203, 8.5, 2];

const getSharedInstructions = (name: string): readonly string[] => {
  return ['AC E', `AN ${name.toUpperCase()}`, 'AH 17999 ft', 'AL SFC'];
};

const getInstruction = (radius: number): readonly string[] => {
  return [
    ...getSharedInstructions('Saint George Class E2'),
    `V X=${coordinateToOpenAir(SGU_AIRPORT_COORDINATES)}`,
    `DC ${radius}`,
  ];
};

const getExtensionInstructions = (bearing: number, distance: number, side: number): readonly string[] => {
  const pointY = getLatLonPoint(SGU_AIRPORT_COORDINATES, bearing, nauticalMilesToKilometers(distance));

  const pointA = getLatLonPoint(pointY, subtractDegreesFromBearing(bearing, 90), nauticalMilesToKilometers(side));
  const pointB = getLatLonPoint(pointY, addDegreesToBearing(bearing, 90), nauticalMilesToKilometers(side));

  const distanceFromAirportToBPoint = pythagoreanTheorem(side, distance);
  const angleA = 90 - solveForAngleA(distance, side, distanceFromAirportToBPoint);
  const distanceFromBPointToCPoint = lawOfCosines(RADIUS, distanceFromAirportToBPoint, angleA);

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

  const bearingFromAirportToPointC = getBearing(SGU_AIRPORT_COORDINATES, pointC);
  const bearingFromAirportToPointD = getBearing(SGU_AIRPORT_COORDINATES, pointD);

  return [
    ...getSharedInstructions(`Saint George E4 ${bearing > 0 && bearing < 90 ? 'NE' : 'SW'}`),
    `DP ${coordinateToOpenAir(pointB)}`,
    `DP ${coordinateToOpenAir(pointA)}`,
    `V X=${coordinateToOpenAir(SGU_AIRPORT_COORDINATES)}`,
    `DA ${RADIUS}, ${bearingFromAirportToPointC.toFixed(6)}, ${bearingFromAirportToPointD.toFixed(6)}`,
  ];
};

export const main = () => {
  console.log('* St. George Regional Airport Class E2 Airspace');
  console.log(getInstruction(RADIUS).join('\n'));
  console.log('\n');
  // NE Extension
  console.log('* St. George Regional Airport Class E4 Airspace - Northeast Segment');
  console.log(getExtensionInstructions(...NE_EXTENSION).join('\n'));
  console.log('\n');
  // SW Extension
  console.log('* St. George Regional Airport Class E4 Airspace - Southwest Segment');
  console.log(getExtensionInstructions(...SW_EXTENSION).join('\n'));
};
