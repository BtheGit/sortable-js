(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("sortablejs", [], factory);
	else if(typeof exports === 'object')
		exports["sortablejs"] = factory();
	else
		root["sortablejs"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/baseSortFunctions.js":
/*!**********************************!*\
  !*** ./src/baseSortFunctions.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _utilities = __webpack_require__(/*! ./utilities */ \"./src/utilities.js\");\n\nvar defaultSort = function defaultSort(a, b, sortUp) {\n  if (sortUp) {\n    if ((0, _utilities.isValidNumber)(a) && (0, _utilities.isValidNumber)(b)) {\n      return (0, _utilities.removeCurrency)(a) - (0, _utilities.removeCurrency)(b);\n    }\n    // localeCompare offers support for non-ASCII characters\n    return a.localeCompare(b);\n  } else {\n    if ((0, _utilities.isValidNumber)(a) && (0, _utilities.isValidNumber)(b)) {\n      return (0, _utilities.removeCurrency)(b) - (0, _utilities.removeCurrency)(a);\n    }\n    return b.localeCompare(a);\n  }\n};\n\nvar baseSortFunctions = {\n  __default__: defaultSort\n};\n\nexports.default = baseSortFunctions;\n\n//# sourceURL=webpack://sortablejs/./src/baseSortFunctions.js?");

/***/ }),

/***/ "./src/create.js":
/*!***********************!*\
  !*** ./src/create.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _utilities = __webpack_require__(/*! ./utilities */ \"./src/utilities.js\");\n\nvar createSortableTable = function createSortableTable(_ref) {\n  var tableContainerNode = _ref.table,\n      headerRowSelector = _ref.headerRowSelector,\n      bodyRowsSelector = _ref.bodyRowsSelector,\n      sortFunctions = _ref.sortFunctions;\n\n  var headersList = tableContainerNode.querySelectorAll(headerRowSelector);\n  var bodyList = tableContainerNode.querySelectorAll(bodyRowsSelector);\n  var headers = Array.from(headersList);\n  var tableBody = Array.from(bodyList);\n\n  if (!headersList.length) {\n    throw new Error('Tables must contain at least 1 column to be sortable');\n  }\n\n  if (!bodyList.length) {\n    throw new Error('Tables must contain rows to be sortable');\n  }\n\n  if (!tableBody.every(function (row) {\n    return row.children.length === headers.length;\n  })) {\n    throw new Error('All rows must contain the same number of columns as the header row');\n  }\n\n  var sort = function sort(e) {\n    if (e.type === 'keydown') {\n      if (['Enter', ' '].indexOf(e.key) === -1) {\n        return;\n      }\n    }\n\n    var sortCol = headers.indexOf(e.target);\n\n    var isSorted = e.target.dataset['sorted'];\n    var sortUp = !isSorted ? true : isSorted === 'up' ? false : true;\n\n    var sortType = e.target.dataset.sortableType || '__default__';\n    var sortFunction = sortFunctions[sortType] || sortFunctions['__default__'];\n\n    var sorted = (0, _utilities.sortRows)(sortFunction, tableBody, sortCol, sortUp);\n    (0, _utilities.reorderRows)(sorted);\n    (0, _utilities.setActiveSortCol)(sortCol, headers, tableBody);\n  };\n\n  try {\n    (0, _utilities.addEventListeners)(headers, sort);\n    return tableContainerNode;\n  } catch (err) {\n    throw err;\n  }\n};\n\nexports.default = createSortableTable;\n\n//# sourceURL=webpack://sortablejs/./src/create.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\n__webpack_require__(/*! ./polyfills */ \"./src/polyfills.js\");\n\nvar _baseSortFunctions = __webpack_require__(/*! ./baseSortFunctions */ \"./src/baseSortFunctions.js\");\n\nvar _baseSortFunctions2 = _interopRequireDefault(_baseSortFunctions);\n\nvar _create = __webpack_require__(/*! ./create */ \"./src/create.js\");\n\nvar _create2 = _interopRequireDefault(_create);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n/**\r\n * \r\n * @param {string} [tableSelector=\"table[data-sortable]\"] The selector used to identify tables designated for sorting\r\n * @return {HTMLElement[]} An array of nodes representing the table elements of sortable tables\r\n */\nvar generateSortableTables = function generateSortableTables() {\n  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},\n      _ref$tableSelector = _ref.tableSelector,\n      tableSelector = _ref$tableSelector === undefined ? 'table[data-sortable]' : _ref$tableSelector,\n      _ref$headerRowSelecto = _ref.headerRowSelector,\n      headerRowSelector = _ref$headerRowSelecto === undefined ? 'thead th' : _ref$headerRowSelecto,\n      _ref$bodyRowsSelector = _ref.bodyRowsSelector,\n      bodyRowsSelector = _ref$bodyRowsSelector === undefined ? 'tbody tr' : _ref$bodyRowsSelector,\n      _ref$customSortFuncti = _ref.customSortFunctions,\n      customSortFunctions = _ref$customSortFuncti === undefined ? {} : _ref$customSortFuncti;\n\n  if (typeof tableSelector !== 'string') {\n    throw new Error('Must use a valid selector string as tableSelector');\n  }\n\n  if ((typeof customSortFunctions === 'undefined' ? 'undefined' : _typeof(customSortFunctions)) !== 'object' || customSortFunctions === null) {\n    throw new Error('customSortFunctions must be a non-null object');\n  }\n\n  var areCustomSortFunctionsValid = Object.keys(customSortFunctions).every(function (presumedFunction) {\n    return typeof customSortFunctions[presumedFunction] === 'function';\n  });\n\n  if (!areCustomSortFunctionsValid) {\n    throw new Error('All custom sort functions must be FUNCTIONS!');\n  }\n\n  try {\n    var sortFunctions = Object.assign({}, _baseSortFunctions2.default, customSortFunctions);\n    var tables = Array.from(document.querySelectorAll(tableSelector));\n    var sortables = tables.map(function (table) {\n      return (0, _create2.default)({\n        table: table,\n        sortFunctions: sortFunctions,\n        headerRowSelector: headerRowSelector,\n        bodyRowsSelector: bodyRowsSelector\n      });\n    });\n    return sortables;\n  } catch (err) {\n    throw err;\n  }\n};\n\nexports.default = generateSortableTables;\n\n//# sourceURL=webpack://sortablejs/./src/index.js?");

/***/ }),

/***/ "./src/polyfills.js":
/*!**************************!*\
  !*** ./src/polyfills.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n// Array.from polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from\nif (!Array.from) {\n  console.log('Array.from polyfilled');\n  Array.from = function () {\n    var toStr = Object.prototype.toString;\n    var isCallable = function isCallable(fn) {\n      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';\n    };\n    var toInteger = function toInteger(value) {\n      var number = Number(value);\n      if (isNaN(number)) {\n        return 0;\n      }\n      if (number === 0 || !isFinite(number)) {\n        return number;\n      }\n      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));\n    };\n    var maxSafeInteger = Math.pow(2, 53) - 1;\n    var toLength = function toLength(value) {\n      var len = toInteger(value);\n      return Math.min(Math.max(len, 0), maxSafeInteger);\n    };\n\n    // The length property of the from method is 1.\n    return function from(arrayLike /*, mapFn, thisArg */) {\n      // 1. Let C be the this value.\n      var C = this;\n\n      // 2. Let items be ToObject(arrayLike).\n      var items = Object(arrayLike);\n\n      // 3. ReturnIfAbrupt(items).\n      if (arrayLike == null) {\n        throw new TypeError('Array.from requires an array-like object - not null or undefined');\n      }\n\n      // 4. If mapfn is undefined, then let mapping be false.\n      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;\n      var T;\n      if (typeof mapFn !== 'undefined') {\n        // 5. else\n        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.\n        if (!isCallable(mapFn)) {\n          throw new TypeError('Array.from: when provided, the second argument must be a function');\n        }\n\n        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.\n        if (arguments.length > 2) {\n          T = arguments[2];\n        }\n      }\n\n      // 10. Let lenValue be Get(items, \"length\").\n      // 11. Let len be ToLength(lenValue).\n      var len = toLength(items.length);\n\n      // 13. If IsConstructor(C) is true, then\n      // 13. a. Let A be the result of calling the [[Construct]] internal method \n      // of C with an argument list containing the single item len.\n      // 14. a. Else, Let A be ArrayCreate(len).\n      var A = isCallable(C) ? Object(new C(len)) : new Array(len);\n\n      // 16. Let k be 0.\n      var k = 0;\n      // 17. Repeat, while k < len… (also steps a - h)\n      var kValue;\n      while (k < len) {\n        kValue = items[k];\n        if (mapFn) {\n          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);\n        } else {\n          A[k] = kValue;\n        }\n        k += 1;\n      }\n      // 18. Let putStatus be Put(A, \"length\", len, true).\n      A.length = len;\n      // 20. Return A.\n      return A;\n    };\n  }();\n}\n\n// Object.assign polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign\nif (typeof Object.assign != 'function') {\n  console.log('Object.assign polyfilled');\n  // Must be writable: true, enumerable: false, configurable: true\n  Object.defineProperty(Object, \"assign\", {\n    value: function assign(target, varArgs) {\n      // .length of function is 2\n      'use strict';\n\n      if (target == null) {\n        // TypeError if undefined or null\n        throw new TypeError('Cannot convert undefined or null to object');\n      }\n\n      var to = Object(target);\n\n      for (var index = 1; index < arguments.length; index++) {\n        var nextSource = arguments[index];\n\n        if (nextSource != null) {\n          // Skip over if undefined or null\n          for (var nextKey in nextSource) {\n            // Avoid bugs when hasOwnProperty is shadowed\n            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {\n              to[nextKey] = nextSource[nextKey];\n            }\n          }\n        }\n      }\n      return to;\n    },\n    writable: true,\n    configurable: true\n  });\n}\n\n//# sourceURL=webpack://sortablejs/./src/polyfills.js?");

/***/ }),

/***/ "./src/utilities.js":
/*!**************************!*\
  !*** ./src/utilities.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nfunction _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }\n\n/**\r\n * \r\n * @param {string} Cell value\r\n * @return {string} Cell value without '$'s or ','s \r\n */\nvar removeCurrency = exports.removeCurrency = function removeCurrency(str) {\n  return str.replace(/[$,]/g, '');\n};\n\n/**\r\n * To evaluate whether a string should in fact be treated as a number for purposes of sorting we:\r\n * a) Remove dollar signs and commas.\r\n * b) Use the native Javascript isNaN to see if the remaining string parses as a number or not.\r\n * \r\n * @param {string} Cell value\r\n * @return {boolean}\r\n */\nvar isValidNumber = exports.isValidNumber = function isValidNumber(str) {\n  return !isNaN(removeCurrency(str));\n};\n\n/**\r\n * Javascript's native Array sort is not stable across all browsers. Instead of using a completely different sorting\r\n * algorithm, a simple check of equality and deference to index order in cases where it exists allows us\r\n * to have the same stability as something like a merge sort.\r\n * \r\n * @param {function} sortFunction \r\n * @param {HTMLElement[]} unsorted \r\n * @param {number} sortCol \r\n * @param {boolean} sortUp\r\n * @return {HTMLElement[]} Array of Nodes\r\n */\nvar sortRows = exports.sortRows = function sortRows(sortFunction, unsorted, sortCol, sortUp) {\n  var unsortedWithIndex = unsorted.map(function (node, index) {\n    return { node: node, index: index };\n  });\n  var sortedWithIndex = unsortedWithIndex.sort(function (curr, next) {\n    var sortWithContext = function sortWithContext(sortCol, sortUp) {\n      var a = curr.node.children[sortCol].innerText;\n      var b = next.node.children[sortCol].innerText;\n      return sortFunction(a, b, sortUp) || curr.index - next.index;\n    };\n    return sortWithContext(sortCol, sortUp);\n  });\n  var sorted = sortedWithIndex.map(function (_ref) {\n    var node = _ref.node;\n    return node;\n  });\n  return sorted;\n};\n\n/**\r\n * IMPURE: DOM MANIPULATION\r\n * @param {HTMLElement[]} headers \r\n * @param {function} callback \r\n * @return {HTMLElement[]}\r\n */\nvar addEventListeners = exports.addEventListeners = function addEventListeners(headers, callback) {\n  headers.map(function (cell, col) {\n    if (!cell.dataset.hasOwnProperty('fixed')) {\n      cell.tabIndex = 0;\n      cell.dataset['sorted'] = false;\n      cell.addEventListener('click', callback);\n      cell.addEventListener('keydown', callback);\n    }\n  });\n  return headers;\n};\n\n/**\r\n * IMPURE: DOM MANIPULATION\r\n * @param {HTMLElement[]} rows \r\n */\nvar reorderRows = exports.reorderRows = function reorderRows(rows) {\n  for (var i = rows.length - 1; i > 0; i--) {\n    var secondNode = rows[i];\n    var firstNode = rows[i - 1];\n    var parent = secondNode.parentNode;\n    parent.insertBefore(firstNode, secondNode);\n  }\n};\n\n/**\r\n * IMPURE: DOM MANIPULATION\r\n * This function serves two purposes. \r\n * a) Our sort function will rely on reading off the current sort direction/state from the column header, this is how\r\n * we update that.\r\n * \r\n * b) To create hooks that allow for styling all cells currently being sorted.\r\n * \r\n * @param {number} sortCol \r\n * @param {HTMLElement[]} headers \r\n * @param {HTMLElement[]} tableBody \r\n */\nvar setActiveSortCol = exports.setActiveSortCol = function setActiveSortCol(sortCol, headers, tableBody) {\n  headers.map(function (col, idx) {\n    if (col.dataset.hasOwnProperty('fixed')) return;\n    col.dataset['sorted'] = idx !== sortCol ? false : col.dataset['sorted'] === 'up' ? 'down' : 'up';\n  });\n  tableBody.map(function (row) {\n    [].concat(_toConsumableArray(row.children)).map(function (cell, idx) {\n      cell.dataset['sorted'] = idx === sortCol;\n    });\n  });\n};\n\n//# sourceURL=webpack://sortablejs/./src/utilities.js?");

/***/ })

/******/ });
});