# Bulk properties

Goals

* Facilitate population of DOM from JavaScript, e.g., from objects reconstructed from JSON.
* Support fast updates in Functional-Reactive Programming (FRP) architectures.
* Work well with web components.

https://github.com/JedWatson/classnames


## Setting bulk properties

* `attributes`: Dictionary in which each `name: value` is equivalent to calling `setAttribute(key, value)`. Known Boolean attributes (`checked`,`defer`,`disabled`,`hidden`,`ismap`,`multiple`,`noresize`,`readonly`,`selected`) have special behavior: a falsy `value` results in a call to `removeAttribute(key)`.
* `classList`: Dictionary in which each `name: value` is equivalent to calling `classList.toggle(name, value)`.
* `style`: Dictionary in which each `name: value` is equivalent to calling `style[name] = value`.
* `childNodes`: A `NodeList` or `Array` of `Node` elements. Equivalent to calling `appendChild()` for each item in the list/array.

All other keys result in invoking a _property_ (not attribute) with the indicated key.


## Getting bulk properties


## Updating a tree of elements

node tree, document fragment, shadow tree


## Updating properties

If the supplied dictionary is frozen, and equal to the previous value, the update is skipped.
Same thing for dictionary values, including `attributes`, `classList`, `style`, and `childNodes`.
