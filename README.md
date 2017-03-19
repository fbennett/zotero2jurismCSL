# zotero2jurismCSL

This is a simple package for use with the `libzotero` package and the
Zotero API. It provides a single method `convert`, which unpacks any
extended data encoded in the *Extra* field of a Zotero item, returning
a CSL object suitable for use with the citeproc-js citation processor
provided by the `citeproc` package. Extended Juris-M data may include
item type overrides, extended fields and creators, and multilingual
variants.

## Sample usage

Assuming a `zoteroItem` has been acquired, the method
is invoked like so:

    var cslConvert = require('zotero2jurismCSL').convert;
    var cslItem = cslConvert(zoteroItem);

Frank Bennett
2017.03.19
