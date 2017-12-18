# Bulk property updates for HTML elements

This repository considers the possibility of introducing new DOM API methods to efficiently set multiple HTML element properties at once, on either a single element or a collection of elements identified with `id`s.

Example:

```js
const div = document.createElement('div');
div.applyProperties({
  attributes: {
    role: 'main'
  },
  style: {
    color: 'red'
  },
  textContent: 'Hello, world.'
});
```

The above would be exactly equivalent to:

```js
const div = document.createElement('div');
div.setAttribute('role', 'main');
div.style.color = 'red';
div.textContent = 'Hello, world.';
```

In either case, the result would be the same:

```html
<div role="main" style="color: red;">Hello, world.<div>
```

[Live demo](https://cdn.rawgit.com/ComponentKitchen/bulk-properties/21136154/demos/hello.html) ([Source](demos/hello.html))


## Goals

* Generally facilitate population and manipulation of DOM from JavaScript, e.g., in Functional-Reactive Programming (FRP) architectures. Rather that introducing new capabilities, this simply formalizes very common JavaScript patterns for creating and updating DOM elements.
* Support fast updates by allowing the browser to update multiple properties and elements in a single DOM call.
* Allow web components to efficiently reflect state changes in their shadow trees.


## `applyProperties` method

The `applyProperties` method would be added to `Element.prototype`. This method applies a dictionary of properties to the indicated element.


### Modifying designated collection properties

The `Element` prototype exposes several properties that expose a collection that can be modified but not set directly: `attributes`, `childNodes`, `classList`, and (for `HTMLElement` and `SVGElement`) `style`. Although these properties cannot be directly set (you can't write `element.attributes = newAttributes`), we can define simple and useful write semantics for updating these properties in the context of the `applyProperties` method.

In each case, we define the write semantics in terms of existing DOM write methods:

* `attributes` property: Sets multiple attributes at once. This takes a subdictionary in which each `name: value` is equivalent to calling `setAttribute(key, value)`. Passing a nullish `value` acts like `removeAttribute(key)`. Known Boolean attributes (e.g., `disabled`) are slightly different: a truthy `value` has the effects of `setAttribute(key, '')`, and a falsy `value` acts like `removeAttribute(key)`.

* `childNodes` property: Sets an element's `childNodes`. This takes a `NodeList` or array of `Node` elements. This is equivalent to calling `removeChild()` on any nodes _not_ in the supplied value, then calling `appendChild()` for each node in the supplied value.

* `classList` property: Sets/clears multiple classes at once. This takes a subdictionary in which each `name: value` is equivalent to calling `classList.toggle(name, value)`.

* `style` property: Sets multiple style values at once. This takes a subdictionary in which each `name: value` is equivalent to calling `style[name] = value`. Attempting to update `style` on something other than a `HTMLElement` or `SVGElement` throws an exception.

Note that `applyProperties` is _updating_ the indicated properties, leaving in place any other existing element attributes, classes, or styles not specifically referenced in the dictionary:

```js
const div = document.createElement('div');
div.classList.add('foo bar');
div.applyProperties({
  classList: {
    bar: false, // Removes bar
    baz: true   // Adds baz
  }
});
div.classList.value // "foo baz"
```

The ability to update `childNodes` facilitates construction of DOM through code that, for example, maps an array of model objects to an array of DOM elements that should be added to the DOM.

```js
const objects = [...];
const elements = objects.map(object => 
  document.createElement('div', { properties })
);
document.body.applyProperties({
  childNodes: elements
});
```

[Live demo](https://cdn.rawgit.com/ComponentKitchen/bulk-properties/21136154/demos/array.html) ([Source](demos/array.html))



### Modifying other properties

All other property dictionary keys result in invoking the property with the corresponding name. E.g.,

```js
element.applyProperties({ foo: 'bar' });
```

is equivalent to

```js
element.foo = 'bar';
```

This can be used to set both native HTML element properties as well as custom element properties.


## `applyPropertiesById` method

A related method, `applyPropertiesById`, allows the application of properties to a set of elements identified by `id`. This method would be exposed on `Document` and `DocumentFragment`.

```html
<body>
  <div id="foo">
    <div id="bar"></div>
  </div>
</body>
```

```js
document.applyPropertiesById({
  foo: {
    style: {
      color: 'red'
    }
  },
  bar: {
    textContent: 'Hello, world.'
  }
});
```

[Live demo](https://cdn.rawgit.com/ComponentKitchen/bulk-properties/21136154/demos/applyPropertiesById.html) ([Source](demos/applyPropertiesById.html))

For each `key: value` in the supplied dictionary, `applyPropertiesById` takes the `key` as an `id`, and finds the corresponding element in the relevant tree via `getElementById(key)`. If the element is found, it passes the `value` as a property dictionary to `applyProperties(element, value)`.

The above code is exactly equivalent to:

```js
const foo = document.getElementById('foo');
foo.style.color = 'red';
const bar = document.getElementById('bar');
bar.textContent = 'Hello, world.';
```

In both cases, the result is:

```html
<body>
  <div id="foo" style="color: red;">
    <div id="bar">Hello, world.</div>
  </div>
</body>
```


The use of `applyPropertiesById` is particularly useful in web components that want to reflect component state in their shadow tree. E.g., when component state changes, it might invoke

```js
const changes = {
  element1: { /* changes for element1 */ },
  element2: { /* changes for element2 */ },
  ...
}
this.shadowRoot.applyPropertiesById(changes);
```

[Live demo](https://cdn.rawgit.com/ComponentKitchen/bulk-properties/21136154/demos/incrementDecrement.html) ([Source](demos/incrementDecrement.html))


## `document.createElement` parameter

It would be useful to accept the same properties dictionary as an options parameter to `createElement`/`createElementNS`. The example at the top of this document could be written more concisely as:

```js
const element = document.createElement('div', {
  attributes: {
    role: 'main'
  },
  style: {
    color: 'red'
  },
  textContent: 'Hello, world.'
});
```

Note: `createElement`/`createElementNS` currently accept an additional argument with `options`, which at the moment is just the standard (but not universally supported) `is` option. There are likely several ways the existing options parameter could be reconciled with the suggestion above.
