export const removeCurrency = str => str.replace(/[$,]/g, '');

export const isValidNumber = str => !isNaN(removeCurrency(str));

// Array.prototype.sort uses a stable merge sort in Safari and Firefox but not in all
// browers. Instead of reimplementing one of those methods, a simple check of equality
// here lets us use the rows initial order when the values are the same.
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

export const rebuildTable = (rows, tableBodyContainer, tableContainerNode, tableBody) => {
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