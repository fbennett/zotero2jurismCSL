# zotero2jurismCSL

This is a simple package for use with the `libzotero` package or with
raw returns from and the Zotero API. It provides a single method
`convert`, which unpacks any extended data encoded in the *Extra*
field of a Zotero item, returning a CSL object suitable for use with
the citeproc-js citation processor provided by the `citeproc` package.
Extended Juris-M data may include item type overrides, extended fields
and creators, and multilingual variants.

## Sample usage

Assuming a `zoteroItem` has been acquired, the method
can be invoked on a `libzotero` item like so:
```bash
    const zoteroToCSLM = require('zotero2jurismcsl').convert;
    var cslItem = zoteroToCSLM(zoteroItem);
```

For raw Zotero API items, invoke the method like so:
```bash
    const zoteroToCSL = require('zotero-to-csl');
    const zoteroToCSLM = require('zotero2jurismcsl').convert;
    var cslData = zoteroToCSL(zoteroAPIitem.data);
    var cslItem = zoteroToCSLM(zoterAPIitem, cslData);
```

Frank Bennett
2019.04.24
