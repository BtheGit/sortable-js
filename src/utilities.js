/**
 * 
 * @param {string} Cell value
 * @return {string} Cell value without '$'s or ','s 
 */
export const removeCurrency = str => str.replace(/[$,]/g, '');

/**
 * To evaluate whether a string should in fact be treated as a number for purposes of sorting we:
 * a) Remove dollar signs and commas.
 * b) Use the native Javascript isNaN to see if the remaining string parses as a number or not.
 * 
 * @param {string} Cell value
 * @return {boolean}
 */
export const isValidNumber = str => !isNaN(removeCurrency(str));

/**
 * Javascript's native Array sort is not stable across all browsers. Instead of using a completely different sorting
 * algorithm, a simple check of equality and deference to index order in cases where it exists allows us
 * to have the same stability as something like a merge sort.
 * 
 * @param {function} sortFunction 
 * @param {HTMLElement[]} unsorted 
 * @param {number} sortCol 
 * @param {boolean} sortUp
 * @return {HTMLElement[]} Array of Nodes
 */
export const sortRows = (sortFunction, unsorted, sortCol, sortUp) => {
  const unsortedWithIndex = unsorted.map((node, index) => ({ node, index }));
  const sortedWithIndex = unsortedWithIndex.sort((curr, next) => {
    const sortWithContext = (sortCol, sortUp) => {
      const a = curr.node.children[sortCol].innerText;
      const b = next.node.children[sortCol].innerText;
      return sortFunction(a, b, sortUp) || curr.index - next.index;
    };
    return sortWithContext(sortCol, sortUp);
  });
  const sorted = sortedWithIndex.map(({ node }) => node);
  return sorted;
}

/**
 * IMPURE: DOM MANIPULATION
 * @param {HTMLElement[]} headers 
 * @param {function} callback 
 * @return {HTMLElement[]}
 */
export const addEventListeners = (headers, callback) => {
  headers.map((cell, col) => {
    if(!cell.dataset.hasOwnProperty('fixed')){
      cell.tabIndex = 0;
      cell.dataset['sorted'] = false;
      cell.addEventListener('click', callback);
      cell.addEventListener('keydown', callback);
    }
  })
  return headers;
}

/**
 * IMPURE: DOM MANIPULATION
 * @param {HTMLElement[]} rows 
 */
export const reorderRows = rows => {
  for(let i = rows.length - 1; i > 0; i--){
    const secondNode = rows[i];
    const firstNode = rows[i-1];
    const parent = secondNode.parentNode;
    parent.insertBefore(firstNode, secondNode);
  }
}

/**
 * IMPURE: DOM MANIPULATION
 * This function serves two purposes. 
 * a) Our sort function will rely on reading off the current sort direction/state from the column header, this is how
 * we update that.
 * 
 * b) To create hooks that allow for styling all cells currently being sorted.
 * 
 * @param {number} sortCol 
 * @param {HTMLElement[]} headers 
 * @param {HTMLElement[]} tableBody 
 */
export const setActiveSortCol = (sortCol, headers, tableBody) => {
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