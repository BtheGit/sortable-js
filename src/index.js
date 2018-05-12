import baseSortFunctions from './baseSortFunctions';
import createSortableTable from './create';

/**
 * 
 * @param {string} [tableSelector="table[data-sortable]"] The selector used to identify tables designated for sorting
 * @return {HTMLElement[]} An array of nodes representing the table elements of sortable tables
 */
const generateSortableTables = ({
  tableSelector = 'table[data-sortable]',
  columnHeadersSelector = 'thead th',
  bodyRowsSelector = 'tbody tr',
  customSortFunctions = {},
} = {}) => {
  if(typeof tableSelector !== 'string'){
    throw new Error('Must use a valid selector string as tableSelector');
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
    const tables = Array.from(document.querySelectorAll(tableSelector));
    const sortables = tables.map(table => {
      return createSortableTable({ 
        table, 
        sortFunctions, 
        columnHeadersSelector,
        bodyRowsSelector,
      });
    })
    return sortables;
  }
  catch(err) {
    throw err;
  }
}

export default generateSortableTables;