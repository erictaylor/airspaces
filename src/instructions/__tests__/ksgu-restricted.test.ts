import { describe, expect, it } from 'bun:test';
import {
  BEARING,
  SIDE,
  getEastExtensionInstructions,
  getPrimaryInstructions,
  getWestExtensionInstructions,
} from '../ksgu-restricted';

describe('KSGU Ultralight Restricted Instructions', () => {
  it('should return the expected primary instructions', () => {
    expect(getPrimaryInstructions(BEARING, SIDE)).toMatchSnapshot();
  });

  it('should return the expected east extension instructions', () => {
    expect(getEastExtensionInstructions(BEARING, SIDE)).toMatchSnapshot();
  });

  it('should return the expected west extension instructions', () => {
    expect(getWestExtensionInstructions(BEARING, SIDE)).toMatchSnapshot();
  });
});
