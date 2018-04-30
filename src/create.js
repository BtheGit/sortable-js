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

  try{
    addEventListeners(headers, sort);
    return tableContainerNode;
  }
  catch(err){
    throw err;
  }
}

export default createSortableTable;