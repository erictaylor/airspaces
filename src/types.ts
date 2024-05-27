export type LatitudeCardinalDirection = 'N' | 'S';
export type LongitudeCardinalDirection = 'E' | 'W';
export type CardinalDirection =
  | LatitudeCardinalDirection
  | LongitudeCardinalDirection;

export type Coordinate = [latitude: number, longitude: number];

export type InstructionType =
  | 'AC'
  | 'AH'
  | 'AL'
  | 'AN'
  | 'AT'
  | 'DA'
  | 'DB'
  | 'DC'
  | 'DP'
  | 'DY'
  | 'V';

export type Instruction = readonly [type: InstructionType, value: string];
export type Instructions = readonly Instruction[];
export type Airspace = readonly string[];

export type AirspaceClass =
  // Restricted
  | 'R'
  // Danger
  | 'Q'
  // Prohibited
  | 'P'
  // Class A
  | 'A'
  // Class B
  | 'B'
  // Class C
  | 'C'
  // Class D
  | 'D'
  // Class E
  | 'E'
  // Glider Prohibited
  | 'GP'
  // CTR
  | 'CTR'
  // Wave Window
  | 'W';

type InstructionAction<T extends InstructionType, V> = [type: T, value: V];

/**
 * The airspace class.
 */
type InstructionACAction = InstructionAction<'AC', AirspaceClass>;

/**
 * The name of the airspace.
 */
type InstructionANAction = InstructionAction<'AN', string>;

/**
 * The ceiling of the airspace.
 * In feet.
 */
type InstructionAHAction = InstructionAction<'AH', number>;

/**
 * The floor of the airspace.
 * In feet.
 */
type InstructionALAction = InstructionAction<'AL', number | 'SFC'>;

/**
 * Coordinate of where to place a name label on the map.
 */
type InstructionATAction = InstructionAction<'AT', Coordinate>;

/**
 * A polygon point.
 */
type InstructionDPAction = InstructionAction<'DP', Coordinate>;

/**
 * Add an arc, angles in degrees, radius in nm.
 * Set center using V X=lat,lon
 */
type InstructionDAAction = InstructionAction<
  'DA',
  { radius: number; angleStart: number; angleEnd: number }
>;

/**
 * Add an arc, from coordinate 1 to coordinate 2.
 */
type InstructionDBAction = InstructionAction<
  'DB',
  [coordinate1: Coordinate, coordinate2: Coordinate]
>;

/**
 * Draw a circle (center taken from the previous V X= record. Radius in nm.)
 */
type InstructionDCAction = InstructionAction<'DC', number>;

/**
 * Add a segment of an airway.
 */
type InstructionDYAction = InstructionAction<'DY', Coordinate>;

/**
 * Variable assignment
 *
 * Currently the following variables are supported:
 * - D={+|-} Sets direction for: DA and DB records.
 *           - '-' means counterclockwise direction; '+' is the default.
 *           - automatically reset to '+' at the beginning of new airspace segment
 * - X={coordinate} Sets the center for the following records: DA, DB, and DC.
 * - W={number} Sets the width of an airway in nm
 * - Z={number} Sets zoom level at which the element becomes visible.
 */
type InstructionVAction = InstructionAction<
  'V',
  | { variable: 'X'; value: Coordinate }
  | { variable: 'D'; value: '+' | '-' }
  | { variable: 'W'; value: number }
  | { variable: 'Z'; value: number }
>;

export type InstructionActions =
  | InstructionACAction
  | InstructionANAction
  | InstructionAHAction
  | InstructionALAction
  | InstructionATAction
  | InstructionDPAction
  | InstructionDAAction
  | InstructionDBAction
  | InstructionDCAction
  | InstructionDYAction
  | InstructionVAction;
