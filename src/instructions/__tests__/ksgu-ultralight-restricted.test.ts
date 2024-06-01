import { describe, expect, it, setSystemTime } from 'bun:test';
import {
  BEARING,
  SIDE,
  getEastExtensionInstructions,
  getPrimaryInstructions,
  getWestExtensionInstructions,
  main,
} from '../ksgu-ultralight-restricted.ts';

describe('KSGU Ultralight Restricted Instructions', () => {
  it('should return the expected primary instructions', () => {
    expect(getPrimaryInstructions(BEARING, SIDE)).toMatchSnapshot();
  });

  it('should return the expected east extension instructions', () => {
    expect(getEastExtensionInstructions(BEARING, SIDE)).toMatchSnapshot();
  });

  it('should throw an error if the north point of east extension can not be found', () => {
    expect(() => getEastExtensionInstructions(0, 0.01)).toThrow();
  });

  it('should return the expected west extension instructions', () => {
    expect(getWestExtensionInstructions(BEARING, SIDE)).toMatchSnapshot();
  });

  it('should return the expected airspace file instructions', () => {
    const date = new Date('2024-05-31T00:00:00Z');
    setSystemTime(date);

    expect(main()).toMatchSnapshot();
  });
});
