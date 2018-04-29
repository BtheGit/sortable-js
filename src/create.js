import {
  addEventListeners,
  sortRows,
  rebuildTable,
  setActiveSortCol,
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
    throw new Error('All <tr/>s in <tbody/> must contain the same number of <td/>s as the <tr/> contains <th/>s in the <thead/>')
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

    rebuildTable(sorted, tableBodyContainer, tableContainerNode, tableBody); // TODO Make purer
    setActiveSortCol(sortCol, headers, tableBody);
  }

  try{
    addEventListeners(headers, sort);
    return tableContainerNode;
  }
  catch(err){
    throw err;
  }
}

export default createSortableTable;