import baseSortFunctions from './baseSortFunctions';
const defaultSort = baseSortFunctions['__default__'];

describe('__default__ sort function', () => {
  it('should sort according to the direction specified', () => {
    expect(defaultSort('3', '2.6', true)).toBeGreaterThan(0);
    expect(defaultSort('3', '2.6', false)).toBeLessThan(0);
  })
  it('should sort two numbers as numbers', () => {
    expect(defaultSort('0100', '99', true)).toBeGreaterThan(0);
  })
  it('should sort two strings as strings', () => {
    expect(defaultSort('0100a', '99a', true)).toBeLessThan(0);
  })
  it('should sort mixed types as strings', () => {
    expect(defaultSort('0100', '9a', true)).toBeLessThan(0);
  })
})