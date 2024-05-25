import { SGU_AIRPORT_COORDINATES } from '../constants';
import {
  addDegreesToBearing,
  coordinateToOpenAir,
  getLatLonPoint,
  nauticalMilesToKilometers,
  subtractDegreesFromBearing,
} from '../utils';

const BEARING = 24;
const SIDE = 0.75;

const NORTH_DISTANCE = 3.25;
const SOUTH_DISTANCE = 2.5;

const getSharedInstructions = (name: string): readonly string[] => {
  return ['AC R', `AN ${name.toUpperCase()}`, 'AH 17999 ft', 'AL SFC'];
};

const getPrimaryInstructions = (bearing: number, side: number): readonly string[] => {
  const pointN = getLatLonPoint(SGU_AIRPORT_COORDINATES, bearing, nauticalMilesToKilometers(NORTH_DISTANCE));
  const pointS = getLatLonPoint(
    SGU_AIRPORT_COORDINATES,
    addDegreesToBearing(bearing, 180),
    nauticalMilesToKilometers(SOUTH_DISTANCE),
  );

  const pointA = getLatLonPoint(pointN, subtractDegreesFromBearing(bearing, 90), nauticalMilesToKilometers(side));
  const pointB = getLatLonPoint(pointN, addDegreesToBearing(bearing, 90), nauticalMilesToKilometers(side));
  const pointC = getLatLonPoint(
    pointS,
    subtractDegreesFromBearing(addDegreesToBearing(bearing, 180), 90),
    nauticalMilesToKilometers(side),
  );
  const pointD = getLatLonPoint(
    pointS,
    addDegreesToBearing(addDegreesToBearing(bearing, 180), 90),
    nauticalMilesToKilometers(side),
  );

  return [
    ...getSharedInstructions('KSGU Ultralight Vehicles Restricted Primary'),
    `DP ${coordinateToOpenAir(pointA)}`,
    `DP ${coordinateToOpenAir(pointB)}`,
    `DP ${coordinateToOpenAir(pointC)}`,
    `DP ${coordinateToOpenAir(pointD)}`,
  ];
};

const getEastExtensionInstructions = (): readonly string[] => {
  return [
    ...getSharedInstructions('KSGU Ultralight Vehicles Restricted East Ext'),
    'DP 037:02:59.85 N 113:29:08.08 W',
    'DP 037:01:23.80 N 113:29:07.50 W',
    'DP 037:00:37.40 N 113:29:59.50 W',
    'DP 037:00:34.42 N 113:30:29.23 W',
  ];
};

const getWestExtensionInstructions = (bearing: number, side: number): readonly string[] => {
  const pointW = getLatLonPoint(
    SGU_AIRPORT_COORDINATES,
    subtractDegreesFromBearing(bearing, 90),
    nauticalMilesToKilometers(side),
  );

  return [
    ...getSharedInstructions('KSGU Ultralight Vehicles Restricted West Ext'),
    `DP ${coordinateToOpenAir(pointW)}`,
    'DP 037:00:12.47 N 113:32:44.64 W',
    'DP 037:00:57.00 N 113:33:27.00 W',
    'DP 037:01:36.50 N 113:32:57.00 W',
    `DP ${coordinateToOpenAir(pointW)}`,
  ];
};

export const main = () => {
  /**
   * KSGU Ultralight Vehicles Do Not Fly Zone Primary
   *
   * St. George Regional Airport, UT
   * Lat. 37°02′11″ N., long. 113°30′37″ W.
   *
   * Airspace extending upward from the surface within 0.75 miles each
   * side of the St. George Regional Airport 024° bearing from the airport
   * 3.25 miles northeast of the airport, and within 0.75 miles each side
   * of the airport 204° bearing from the airport 2.5 miles southwest of
   * the airport.
   *
   * This zone will be known as the "primary" do not fly zone.
   */
  console.log('* Primary');
  console.log(getPrimaryInstructions(BEARING, SIDE).join('\n'));
  console.log('\n');
  /**
   * KSGU Ultralight Vehicles Do Not Fly Zone East Ext
   *
   * Airspace extending to the east of the primary zone (described
   * above) to include covering the area west of SR-7 (ie Southern Pkwy)
   * back to the primary zone.
   */
  console.log('* East Ext');
  console.log(getEastExtensionInstructions().join('\n'));
  console.log('\n');
  /**
   * KSGU Ultralight Vehicles Do Not Fly Zone West Ext
   *
   * Airspace extending to the west of the primary zone (described
   * above) to include covering parts of the "White Dome Nature Preserve"
   * area towards but not including River Rd, and north to but not including
   * the area occupied by the Family Dollar Distribution Center and
   * UPS Customer Center before cutting back to the west mid point of
   * the primary zone (roughly 037°02′29.26″ N. 113°31′28.41″ W.).
   *
   * The areas ends south of the Family Dollar Distribution Center
   */
  console.log('* West Ext');
  console.log(getWestExtensionInstructions(BEARING, SIDE).join('\n'));
};