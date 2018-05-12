import {
  removeCurrency,
  isValidNumber,
} from './utilities';

describe('removeCurrency()', () => {
  it('should strip all dollar signs and commas from a string', () => {
    const example1 = '$a$b,c$,';
    expect(removeCurrency(example1)).toBe('abc');
  })
})

describe('isValidNumber()', () => {
  it('should disregard dollar signs or commas in determining numbers', () => {
    const example1 = '$1,000';
    expect(isValidNumber(example1)).toBe(true);
  })
  it('should reject null, undefined, booleans, objects, and arrays (in strings)', () => {
    expect(isValidNumber('null')).toBe(false);
    expect(isValidNumber('undefined')).toBe(false);
    expect(isValidNumber('true')).toBe(false);
    expect(isValidNumber("{ 1: '123'}")).toBe(false);
    expect(isValidNumber('[1,2]')).toBe(false);
  })
  it('should accept negative numbers and decimals', () => {
    expect(isValidNumber('-1.35')).toBe(true);
  })
})

