import baseSortFunctions from './baseSortFunctions';
import {
  addEventListeners,
  sortRows,
} from './utilities';

// Array.from polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
if (!Array.from) {
  Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike/*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;

      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }

      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method 
      // of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      var k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  }());
}

// Object.assign polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (typeof Object.assign != 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) { // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}

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