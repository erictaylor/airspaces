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
  getIntersectionPointAtLongitude,
  getLatLonPoint,
  getMidpoint,
  nauticalMilesToKilometers,
  subtractDegreesFromBearing,
} from '../utils/mapping.ts';

export const BEARING = 24;
export const SIDE = 0.75;

const NORTH_DISTANCE = 3.25;
const SOUTH_DISTANCE = 2.5;

const CEILING = 17999;
const FLOOR = 'SFC';

export const getPrimaryInstructions = (
  bearing: number,
  side: number,
): Airspace => {
  const pointN = getLatLonPoint(
    SGU_AIRPORT_COORDINATES,
    bearing,
    nauticalMilesToKilometers(NORTH_DISTANCE),
  );
  const pointS = getLatLonPoint(
    SGU_AIRPORT_COORDINATES,
    addDegreesToBearing(bearing, 180),
    nauticalMilesToKilometers(SOUTH_DISTANCE),
  );

  const pointA = getLatLonPoint(
    pointN,
    subtractDegreesFromBearing(bearing, 90),
    nauticalMilesToKilometers(side),
  );
  const pointB = getLatLonPoint(
    pointN,
    addDegreesToBearing(bearing, 90),
    nauticalMilesToKilometers(side),
  );
  const pointC = getLatLonPoint(
    pointS,
    subtractDegreesFromBearing(bearing, 180 + 90),
    nauticalMilesToKilometers(side),
  );
  const pointD = getLatLonPoint(
    pointS,
    addDegreesToBearing(bearing, 180 + 90),
    nauticalMilesToKilometers(side),
  );

  return buildAirspace(
    {
      airspaceClass: 'R',
      name: 'KSGU Ultralight Vehicles Restricted Primary',
      ceiling: CEILING,
      floor: FLOOR,
    },
    [
      ['DP', pointA],
      ['DP', pointB],
      ['DP', pointC],
      ['DP', pointD],
    ],
  );
};

export const getEastExtensionInstructions = (
  bearing: number,
  side: number,
): Airspace => {
  const pointN = getLatLonPoint(
    SGU_AIRPORT_COORDINATES,
    bearing,
    nauticalMilesToKilometers(NORTH_DISTANCE),
  );
  const pointS = getLatLonPoint(
    SGU_AIRPORT_COORDINATES,
    addDegreesToBearing(bearing, 180),
    nauticalMilesToKilometers(SOUTH_DISTANCE),
  );

  const pointB = getLatLonPoint(
    pointN,
    addDegreesToBearing(bearing, 90),
    nauticalMilesToKilometers(side),
  );
  const pointC = getLatLonPoint(
    pointS,
    subtractDegreesFromBearing(bearing, 180 + 90),
    nauticalMilesToKilometers(side),
  );

  const northPoint = getIntersectionPointAtLongitude(
    pointB,
    pointC,
    -113.485015,
  );

  if (!northPoint) {
    throw new Error(
      'Something went wrong while calculating the intersection point for the east extension.',
    );
  }

  return buildAirspace(
    {
      airspaceClass: 'R',
      name: 'KSGU Ultralight Vehicles Restricted East Ext',
      ceiling: CEILING,
      floor: FLOOR,
    },
    [
      ['DP', northPoint],
      ['DP', [37.023278, -113.485417]],
      ['DP', [37.010389, -113.499861]],
      ['DP', [37.009561, -113.508119]],
    ],
  );
};

export const getWestExtensionInstructions = (
  bearing: number,
  side: number,
): Airspace => {
  const pointS = getLatLonPoint(
    SGU_AIRPORT_COORDINATES,
    addDegreesToBearing(bearing, 180),
    nauticalMilesToKilometers(SOUTH_DISTANCE),
  );
  const pointW = getLatLonPoint(
    SGU_AIRPORT_COORDINATES,
    subtractDegreesFromBearing(bearing, 90),
    nauticalMilesToKilometers(side),
  );

  const southWestBearing = addDegreesToBearing(bearing, 180);

  const pointD = getLatLonPoint(
    pointS,
    addDegreesToBearing(southWestBearing, 90),
    nauticalMilesToKilometers(side),
  );

  const pointR1 = getLatLonPoint(
    pointW,
    addDegreesToBearing(southWestBearing, 15),
    nauticalMilesToKilometers(SOUTH_DISTANCE),
  );

  const pointR2 = getLatLonPoint(
    pointW,
    addDegreesToBearing(southWestBearing, 28),
    nauticalMilesToKilometers(SOUTH_DISTANCE - 0.375),
  );

  return buildAirspace(
    {
      airspaceClass: 'R',
      name: 'KSGU Ultralight Vehicles Restricted West Ext',
      ceiling: CEILING,
      floor: FLOOR,
    },
    [
      ['DP', pointW],
      ['DP', pointD],
      ['V', { variable: 'X', value: pointW }],
      ['DB', [pointD, pointR1]],
      [
        'V',
        {
          variable: 'X',
          value: getLatLonPoint(
            getMidpoint(pointR1, pointR2),
            addDegreesToBearing(getBearing(pointR1, pointR2), 90),
            nauticalMilesToKilometers(0.375),
          ),
        },
      ],
      ['DB', [pointR1, pointR2]],
      ['DP', pointW],
    ],
  );
};

export const main = (): Airspace => {
  return [
    buildHeader(`Last Generated: ${new Date().toISOString()}

Usage of this file is NOT to be considered a "prior authorization"
to be in the KSGU airspace under FAR 103.17. This file is to be used
by operators with existing "prior authorization" to help communicate
the spaces to be considered restricted to ultralight vehicle operators
with existing prior authorization to be in the airspace.

Operators with prior authorization from the KSGU airport manager
should:
  - Stay below 500ft AGL in the E2 and E4 airspaces.
  - Not enter the airspaces around the airport listed in this file.

Resources:
  - https://www.ecfr.gov/current/title-14/chapter-I/subchapter-F/part-103`),

    buildComment(`KSGU Ultralight Vehicles Do Not Fly Zone Primary

St. George Regional Airport, UT
Lat. 37°02′11″ N., long. 113°30′37″ W.

Airspace extending upward from the surface within 0.75 miles each
side of the St. George Regional Airport 024° bearing from the airport
3.25 miles northeast of the airport, and within 0.75 miles each side
of the airport 204° bearing from the airport 2.5 miles southwest of
the airport.

This zone will be known as the "primary" do not fly zone.
`),

    getPrimaryInstructions(BEARING, SIDE).join('\n'),
    '',

    buildComment(`KSGU Ultralight Vehicles Do Not Fly Zone East Ext

Airspace extending to the east of the primary zone (described
above) to include covering the area west of SR-7 (ie Southern Pkwy)
back to the primary zone.
`),
    getEastExtensionInstructions(BEARING, SIDE).join('\n'),
    '',

    buildComment(`KSGU Ultralight Vehicles Do Not Fly Zone West Ext

Airspace extending to the west of the primary zone (described
above) to include covering parts of the "White Dome Nature Preserve"
area towards but not including River Rd, and north to but not including
the area occupied by the Family Dollar Distribution Center and
UPS Customer Center before cutting back to the west mid point of
the primary zone (roughly 037°02′29.26″ N. 113°31′28.41″ W.).
`),
    getWestExtensionInstructions(BEARING, SIDE).join('\n'),
    '',
  ];
};
