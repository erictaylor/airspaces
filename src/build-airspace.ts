import type {
  Airspace,
  AirspaceClass,
  Coordinate,
  Instruction,
  InstructionActions,
} from './types';
import { decimalDegreesToOpenAir } from './utils';

const coordinateToOpenAir = (coordinate: Coordinate): string => {
  return [
    decimalDegreesToOpenAir(coordinate[0], 'latitude'),
    decimalDegreesToOpenAir(coordinate[1], 'longitude'),
  ].join(' ');
};

const buildInstruction = (...action: InstructionActions): Instruction => {
  const [type, payload] = action;

  switch (type) {
    case 'AC': {
      return [type, payload];
    }

    case 'AN': {
      return [type, payload.toUpperCase()];
    }

    case 'AH':
    case 'AL': {
      return [type, typeof payload === 'number' ? `${payload} ft` : payload];
    }

    case 'AT':
    case 'DP':
    case 'DY': {
      return [type, coordinateToOpenAir(payload)];
    }

    case 'DC': {
      return [type, payload.toString()];
    }

    case 'DA': {
      const { radius, angleStart, angleEnd } = payload;

      if (
        angleStart < 0 ||
        angleStart > 360 ||
        angleEnd < 0 ||
        angleEnd > 360
      ) {
        throw new Error('The angle must be between 0 and 360 degrees.');
      }

      return [
        type,
        `${radius}, ${angleStart.toFixed(6)}, ${angleEnd.toFixed(6)}`,
      ];
    }

    case 'DB': {
      return [
        type,
        [coordinateToOpenAir(payload[0]), coordinateToOpenAir(payload[1])].join(
          ', ',
        ),
      ];
    }

    case 'V': {
      const { variable, value } = payload;

      switch (variable) {
        case 'D':
        case 'W':
        case 'Z': {
          return [type, `${variable}=${value}`];
        }

        case 'X': {
          return [type, [variable, coordinateToOpenAir(value)].join('=')];
        }
      }
    }
  }
};

export const buildAirspace = (
  {
    name,
    airspaceClass,
    ceiling,
    floor,
  }: {
    name: string;
    airspaceClass: AirspaceClass;
    ceiling: number;
    floor: number | 'SFC';
  },
  actions: readonly InstructionActions[],
): Airspace => {
  const instructions = [
    buildInstruction('AC', airspaceClass),
    buildInstruction('AN', name),
    buildInstruction('AH', ceiling),
    buildInstruction('AL', floor),
    ...actions.map((action) => buildInstruction(...action)),
  ];

  return instructions.map((instruction) => instruction.join(' '));
};
