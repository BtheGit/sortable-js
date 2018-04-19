class SortableTable {
  constructor(tableContainer){
    this.tableContainerNode = tableContainer;
    this.headers = Array.from(this.tableContainerNode.querySelector('thead tr').children);
    this.tableBodyContainer = this.tableContainerNode.children[1];
    this.tableBody = Array.from(this.tableBodyContainer.children);
    
    this.rebuildTable = this.rebuildTable.bind(this);
    this.addEventListeners = this.addEventListeners.bind(this);
    this.sort = this.sort.bind(this);
    this.setActiveSortCol = this.setActiveSortCol.bind(this);
    
    this.addEventListeners(this.headers);
  }
  
  addEventListeners(headers){
    headers.map((cell, col) => {
      if(!cell.dataset.hasOwnProperty('fixed')){
        cell.tabIndex = 0;
        cell.dataset['sorted'] = false;
        cell.addEventListener('click', this.sort);
        cell.addEventListener('keydown', this.sort);
      }
    })
  }
  
  rebuildTable(rows){
    const fragment = document.createDocumentFragment();
    fragment.appendChild(this.tableBodyContainer.cloneNode());
    rows.map(row => {
      fragment.children[0].appendChild(row.cloneNode(true));
    })
    this.tableContainerNode.replaceChild(fragment, this.tableContainerNode.querySelector('tbody'));
    this.tableBodyContainer = this.tableContainerNode.children[1];
    this.tableBody = Array.from(this.tableBodyContainer.children);
  }
  
  setActiveSortCol(sortCol){
    this.headers.map((col, idx) => {
      col.dataset['sorted'] = idx !== sortCol ? false : col.dataset['sorted'] === 'up' ? 'down' : 'up';
    })
    this.tableBody.map(row => {
      [...row.children].map((cell, idx) => {
        cell.dataset['sorted'] = idx === sortCol;
      })
    })
  }
  
  sort(e){
      if(e.type === 'keydown') {
        if(!['Enter', ' '].includes(e.key)) {
          return;
        }
      }
      const sortCol = e.target.cellIndex;
      const isSorted = e.target.dataset['sorted'];
      const unsorted = Array.from(this.tableBodyContainer.children);
      const sortUp = !isSorted ? true : isSorted === 'up' ? false : true;
      const sorted = unsorted.sort((curr, next) => {
        let a = curr.children[sortCol].innerText;
        let b = next.children[sortCol].innerText;
        if(sortUp) {
          // localeCompare offers support for non-ASCII characters
          return a.localeCompare(b); 
        }
        else {
          return b.localeCompare(a);
        }
      });
    this.rebuildTable(sorted);
    this.setActiveSortCol(sortCol);
  }
}

const initialize = ({
  hook = 'table[data-sortable]',
} = {}) => {
  if(typeof hook !== 'string'){
    throw new Error('Must use a valid selector string as hook');
  }
  
  try {
    const tables = Array.from(document.querySelectorAll(hook));
    const sortables = tables.map(table => {
      return new SortableTable(table);
    })
    return sortables;
  }
  catch(err) {
    throw err;
  }
}

initialize()