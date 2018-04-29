import './polyfills';
import baseSortFunctions from './baseSortFunctions';
import createSortableTable from './create';


/**
 * 
 * @param {string} [hook="[data-sortable]"] The selector used to identify tables designated for sorting
 * @returns {HTMLElement[]} An array of nodes representing the table elements of sortable tables
 */
const generateSortableTables = ({
  hook = '[data-sortable]',
  customSortFunctions = {},
} = {}) => {
  if(typeof hook !== 'string'){
    throw new Error('Must use a valid selector string as hook');
  }

  if(typeof customSortFunctions !== 'object' || customSortFunctions === null){
    throw new Error('customSortFunctions must be a non-null object')
  }

  const areCustomSortFunctionsValid = Object.keys(customSortFunctions)
                                              .every(presumedFunction => {
                                                return typeof customSortFunctions[presumedFunction] === 'function';
                                              });
  
  if(!areCustomSortFunctionsValid){
    throw new Error('All custom sort functions must be FUNCTIONS!')
  }
  
  try {
    const sortFunctions = Object.assign({}, baseSortFunctions, customSortFunctions);
    const tables = Array.from(document.querySelectorAll(`table${hook}`));
    const sortables = tables.map(table => {
      return createSortableTable({ table, sortFunctions });
    })
    return sortables;
  }
  catch(err) {
    throw err;
  }
}

export default generateSortableTables;