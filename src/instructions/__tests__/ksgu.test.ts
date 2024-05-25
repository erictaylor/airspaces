import { describe, expect, it } from 'bun:test';
import { NE_EXTENSION, RADIUS, SW_EXTENSION, getExtensionInstructions, getInstruction } from '../ksgu';

describe('KSGU Instructions', () => {
  it('should return the expected primary instructions', () => {
    expect(getInstruction(RADIUS)).toMatchSnapshot();
  });

  it('should return the expected northeast extension instructions', () => {
    expect(getExtensionInstructions(...NE_EXTENSION)).toMatchSnapshot();
  });

  it('should return the expected southwest extension instructions', () => {
    expect(getExtensionInstructions(...SW_EXTENSION)).toMatchSnapshot();
  });
});
