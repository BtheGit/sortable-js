# A no-frills Vanilla.JS drop-in library for turning static tables into sortable ones.

[Live Demo](https://bthegit.github.io/sortable-js/)

## To use:

First install in the terminal:

```bash
npm install sortabletables-js
```

Then in your file:

```javascript
import sortablejs from 'sortabletables-js';

sortablejs();
```

or

```javascript
const sortablejs = require('sortabletables-js').default;

sortablejs();
```

## Options

### Table Selector (options.tableSelector)
>Default table selector: 'table[data-sortable]'

By default, to indicate a table should be sortable, add the attribute 'data-sortable' to the table container element. Multiple tables on a single page can be sortable.

If you want to prevent a single column in a sortable table from being sortable, add the attribute 'data-fixed' to the header cell of the column you want to be unsortable.

An optional string representing a custom selector can be passed to the library when initialized. By default the library uses 'table[data-sortable]'.


```javascript
sortablejs({ tableSelector: '.custom-sortable-table-classname' });
```

### Column Header Cells and Body Rows Selectors(options.headerRowSelector & options.bodyRowsSelector)
>Default header cells selector: 'thead th'
>
>Default body rows selector: 'tbody tr'

Use these options to override the default targets for header cells and body rows. This is mostly useful for cases where you may be creating a table using atypical HTML elements.

```javascript
sortablejs({
    tableSelector: '.fake-table',
    headerRowSelector: '.fake-table-header > div',
    bodyRowsSelector: '.fake-table-row',
})
```


### Custom Data Types and Sort Functions (options.customSortFunctions)

Currently, the library uses one generic sort function. It is possible to pass in custom sort functions. To do so you should do two things:

1. Add the data-sortable-type attribute to the header cell of the column you wish to sort with a corresponding value matching the name of your custom sort function.


    ```html
    <th data-sortable-type="color">Colors</th>
    ```

2. Add a corresponding sort function to the cusomSortFunctions object in the settings object.

    ```javascript
    sortablejs({
      tableSelector: 'table[data-sortable]',
      customSortFunctions: {
        color: () => {},
      }
    })
    ```

* IMPORTANT: If you pass a sort function that does not have a matching data-sortable-type on the table, the library will default to using the generic sort function

* DOUBLE DOG IMPORTANT: Do not use a custom sort function with the name \_\_default\_\_ unless you're the sort of person who likes starting off their JS programs with Object.prototype.hasOwnProperty = () => false;

#### Custom Sort Functions (How to write one)

Your custom sort function will be called with three arguments: the current value, the next value, and a boolean representing whether or not the current sort direction is up.

Your sort function should return an integer value representing the desired order of the current and next values. In the case of equality (returning 0), their order will be preserved.

**A basic example of a numerical sort function:**

```javascript
const number = (a, b, sortUp) => {
  return sortUp ? a - b : b - a;
}
```


## Table requirements:

Tables do not need to use table specific elements if a custom override is provided (see second example below)

#### The classic table structure works out of the box with the library's default selectors:

```html
<table data-sortable>
  <thead>
    <tr>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td></td>
      <td></td>
    </tr>
  </tbody>
  <tfoot>
    <td></td>
  </tfoot>
</table>
```
```javascript
sortablejs()
```

#### Using custom selectors we are able to turn simple divs into a sortable table as well:

```html
<div class="fake-table">
  <div class="fake-table-header">
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div class="fake-table-row">
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div class="fake-table-row">
    <div></div>
    <div></div>
    <div></div>
  </div>
</div>
```
```javascript
sortablejs({
    tableSelector: '.fake-table',
    headerRowSelector: '.fake-table-header > div',
    bodyRowsSelector: '.fake-table-row',
})
```

> IMPORTANT:
>
>The number of cells in each row in the body (row.children) must be equal to the number of cells in the header row or an error will be thrown.