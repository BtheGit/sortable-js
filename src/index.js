import baseSortFunctions from './baseSortFunctions';
import {
  addEventListeners,
  sortRows,
} from './utilities';

const createSortableTable = ({
  table,
  sortFunctions,
}) => {
  const tableContainerNode = table;
  const tableHead = tableContainerNode.querySelector('thead');
  if(!tableHead){
    throw new Error('A table must have a <thead/> to be sortable');
  }
  const headerRows = tableHead.querySelectorAll('tr');
  if(!headerRows.length){
    throw new Error('A table must have a <thead/> containing a <tr/> to be sortable')
  }
  if(headerRows.length > 1){
    throw new Error('A table with a <thead/> containing more than one <tr/> is not sortable')
  }
  const headerRow = headerRows[0];
  let headers = Array.from(headerRow.querySelectorAll('th'));
  if(headers.length < 2){
    throw new Error('Tables must contain a <thead/> with more than one <th/> to be sortable')
  }
  let tableBodyContainer = tableContainerNode.querySelector('tbody');
  if(!tableBodyContainer){
    throw new Error('Tables must contain a <tbody/> to be sortable')
  }
  let tableBody = Array.from(tableBodyContainer.children);
  if(tableBody.length < 2){
    throw new Error('Tables must contain a <tbody/> with at least two rows to be sortable')
  }

  if(!tableBody.every(row => row.children.length === headers.length)){
    throw new Error('All <tr/>s in <tbody/> must contain the same number of <td/>s as the <tr/> in the <thead/>')
  }
  
  const rebuildTable = rows => {
    const fakeFragment = document.createElement('div');
    fakeFragment.appendChild(tableBodyContainer.cloneNode());
    rows.map(row => {
      fakeFragment.children[0].appendChild(row.cloneNode(true));
    })
    tableContainerNode.replaceChild(fakeFragment.children[0], tableContainerNode.querySelector('tbody'));
    
    // Update stale references
    tableBodyContainer = tableContainerNode.children[1];
    tableBody = Array.from(tableBodyContainer.children);
  }
  
  const setActiveSortCol = sortCol => {
    headers.map((col, idx) => {
      if(col.dataset.hasOwnProperty('fixed')) return;
      col.dataset['sorted'] = idx !== sortCol ? false : col.dataset['sorted'] === 'up' ? 'down' : 'up';
    });
    tableBody.map(row => {
      [...row.children].map((cell, idx) => {
        cell.dataset['sorted'] = idx === sortCol;
      })
    });
  }
  
  const sort = e => {
    if(e.type === 'keydown') {
      if(['Enter', ' '].indexOf(e.key) === -1) {
        return;
      }
    }
    const unsorted = Array.from(tableBodyContainer.children);
    const sortCol = e.target.cellIndex;

    const isSorted = e.target.dataset['sorted'];
    const sortUp = !isSorted ? true : isSorted === 'up' ? false : true;

    const sortType = e.target.dataset.sortableType || '__default__';
    const sortFunction = sortFunctions[sortType] || sortFunctions['__default__'];

    const sorted = sortRows(sortFunction, unsorted, sortCol, sortUp);    

    rebuildTable(sorted);
    setActiveSortCol(sortCol);
  }

  try{
    addEventListeners(headers, sort);
    return tableContainerNode;
  }
  catch(err){
    throw err;
  }
}


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