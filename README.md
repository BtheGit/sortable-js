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
const sortablejs = require('sortabletables-js');

sortablejs();
```
#### NOTE: This library uses Array.from and Object.assign. These require polyfills for ie11 compatibility.

## Options

### Hook (options.hook)

To indicate a table should be sortable, add the attribute 'data-sortable' to the table element. Multiple tables on a single page can be sortable.

If you want to prevent a single column in a sortable table from being sortable, add the attribute 'data-fixed' to the \<th/> element in the \<thead/> corresponding to the column you want to be unsortable.

An optional string representing a custom selector can be passed to the library when initialized. By default the library uses '[data-sortable]'.


```javascript
sortablejs({ hook: '.custom-sortable-table-classname' });
```

### Custom Data Types and Sort Functions (options.customSortFunctions)

Currently, the library uses one generic sort function. It is possible to pass in custom sort functions. To do so you should do two things:

1. Add the data-sortable-type attribute to the \<th/> of the column you wish to sort with a corresponding value matching the name of your custom sort function.


    ```html
    <th data-sortable-type="color">Colors</th>
    ```

2. Add a corresponding sort function to the cusomSortFunctions object in the settings object.

    ```javascript
    sortablejs({
      hook: '[data-sortable]',
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


## Table requirements

Tables must follow the following basic structure:

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
</table>
```

Tables must:

1) Have a single \<thead/> and single \<tbody/>
2) The \<thead/> must only have one \<tr/> containing at least two \<th/>s
3) The \<tbody/> must contain at least two \<tr/>s
4) The number of \<td/>s in all \<tr/>s in the \<tbody/> must match the number of \<th/>s in the \<thead/>