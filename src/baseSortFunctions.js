import {
  removeCurrency,
  isValidNumber,
} from './utilities';

const defaultSort = (a, b, sortUp) => {
  if(sortUp) {
    if(isValidNumber(a) && isValidNumber(b)){
      return removeCurrency(a) - removeCurrency(b);
    }
    // localeCompare offers support for non-ASCII characters
    return a.localeCompare(b); 
  }
  else {
    if(isValidNumber(a) && isValidNumber(b)){
      return removeCurrency(b) - removeCurrency(a);
    }
    return b.localeCompare(a);
  }
}

const baseSortFunctions = {
  __default__: defaultSort,
}

export default baseSortFunctions;