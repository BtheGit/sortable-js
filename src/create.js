import {
  addEventListeners,
  sortRows,
  reorderRows,
  setActiveSortCol,
} from './utilities';

const createSortableTable = ({
  table: tableContainerNode,
  headerRowSelector,
  bodyRowsSelector,
  sortFunctions,
}) => {
  const headersList = tableContainerNode.querySelectorAll(headerRowSelector);
  const bodyList = tableContainerNode.querySelectorAll(bodyRowsSelector);
  const headers = Array.from(headersList);
  const tableBody = Array.from(bodyList);

  if(!headersList.length){
    throw new Error('Tables must contain at least 1 column to be sortable')
  }

  if(!bodyList.length){
    throw new Error('Tables must contain rows to be sortable')
  }

  if(!tableBody.every(row => row.children.length === headers.length)){
    throw new Error('All rows must contain the same number of columns as the header row')
  }
  
  /**
   * Event Listener used on interaction with header cells.
   * (NOTE: It is also possible to pass synthetic events to this function (as in the case of presort) by wrapping
   * the header cell node in an object using the key 'target')
   * 
   * @param {Event} e
   * @param {string} [e.type] Type of DOM event
   * @param {HTMLElement} e.target Header cell of column to sort
   */
  const sort = e => {
    if(e.type === 'keydown') {
      if(['Enter', ' '].indexOf(e.key) === -1) {
        return;
      }
    }

    const sortCol = headers.indexOf(e.target);

    const isSorted = e.target.dataset['sorted'];
    const sortUp = !isSorted ? true : isSorted === 'up' ? false : true;

    const sortType = e.target.dataset.sortableType || '__default__';
    const sortFunction = sortFunctions[sortType] || sortFunctions['__default__'];

    const sorted = sortRows(sortFunction, tableBody, sortCol, sortUp);    
    reorderRows(sorted);
    setActiveSortCol(sortCol, headers, tableBody);
  }

  /**
   * Though use cases may be limited, the option to have tables sort on initial load could be
   * useful. In order to do so, we will poll the column headers for an attribute 'data-sortable-presort'.
   * Note: Only the first column found with the attribute will be handled.
   * 
   * NOTE: To avoid repetition, we will pass the node to the same sort function as a synthetic event.
   * 
   * @param {HTMLElement[]} headers 
   */
  const presort = headers => {
    const cellToPresort = headers.find(cell => cell.dataset.hasOwnProperty('sortablePresort'));
    if(cellToPresort){
      const syntheticEvent = {
        target: cellToPresort,
      };
      sort(syntheticEvent);
    }
  }

  try{
    addEventListeners(headers, sort);
    presort(headers);
    return tableContainerNode;
  }
  catch(err){
    throw err;
  }
}

export default createSortableTable;