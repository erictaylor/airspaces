import { describe, expect, it, setSystemTime } from 'bun:test';
import {
  NE_EXTENSION,
  RADIUS,
  SW_EXTENSION,
  getExtensionInstructions,
  getInstruction,
  main,
} from '../ksgu.ts';

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

  it('should return the expected airspace file instructions', () => {
    const date = new Date('2024-05-31T00:00:00Z');
    setSystemTime(date);

    expect(main()).toMatchSnapshot();
  });
});
