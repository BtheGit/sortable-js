const createSortableTable = tableContainer => {
  const tableContainerNode = tableContainer;
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
  
  const addEventListeners = headers => {
    headers.map((cell, col) => {
      if(!cell.dataset.hasOwnProperty('fixed')){
        cell.tabIndex = 0;
        cell.dataset['sorted'] = false;
        cell.addEventListener('click', sort);
        cell.addEventListener('keydown', sort);
      }
    })
  }
  
  const rebuildTable = rows => {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(tableBodyContainer.cloneNode());
    rows.map(row => {
      fragment.children[0].appendChild(row.cloneNode(true));
    })
    tableContainerNode.replaceChild(fragment, tableContainerNode.querySelector('tbody'));
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
      if(!['Enter', ' '].includes(e.key)) {
        return;
      }
    }
    const sortCol = e.target.cellIndex;
    const isSorted = e.target.dataset['sorted'];
    const unsorted = Array.from(tableBodyContainer.children);
    const sortUp = !isSorted ? true : isSorted === 'up' ? false : true;
    const sorted = unsorted.sort((curr, next) => {
      let a = curr.children[sortCol].innerText;
      let b = next.children[sortCol].innerText;
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
    });
    rebuildTable(sorted);
    setActiveSortCol(sortCol);
  }

  try{
    addEventListeners(headers);
    return tableContainerNode;
  }
  catch(err){
    throw err;
  }
}

const removeCurrency = str => str.replace(/[$,]/g, '');
const isValidNumber = str => !isNaN(removeCurrency(str));

/**
 * 
 * @param {string} [hook="[data-sortable]"] The selector used to identify tables designated for sorting
 * @returns {HTMLElement[]} An array of nodes representing the table elements of sortable tables
 */
const generateSortableTables = (hook = '[data-sortable]') => {
  if(typeof hook !== 'string'){
    throw new Error('Must use a valid selector string as hook');
  }
  
  try {
    const tables = Array.from(document.querySelectorAll(`table${hook}`));
    const sortables = tables.map(table => {
      return createSortableTable(table);
    })
    return sortables;
  }
  catch(err) {
    throw err;
  }
}

module.exports = generateSortableTables;