# A no-frills Vanilla.JS drop-in library for turning static tables into sortable ones.

## To use:

First install in the terminal:

```bash
npm install sortabletables-js
```

Then in your file:

```javascript
import sortablejs from 'sortable-js';

sortablejs();
```

or

```javascript
const sortablejs = require('sortable-js);

sortablejs();
```

## Options

To indicate a table should be sortable, add the attribute 'data-sortable' to the table element. Multiple tables on a single page can be sortable.

If you want to prevent a single column in a sortable table from being sortable, add the attribute 'data-fixed' to the \<td/> element in the \<thead/> corresponding to the column you want to be unsortable.

An optional string representing a custom selector can be passed to the library when initialized. By default the library uses '[data-sortable]'.

eg:

```javascript
sortablejs('.custom-sortable-table-classname');
```

## Table requirements

Tables must follow the following basic structure:

```html
<table data-sortable>
  <thead>
    <tr>
      <td></td>
      <td></td>
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
2) The \<thead/> must only have one \<tr/> containing at least two \<td/>s
3) The \<tbody/> must contain at least two \<tr/>s
4) The number of columns in all \<tr/>s in the table must match