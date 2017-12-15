

export function getProperties() {

  const props = {};

  const { attributes, classes, style } = updates.current(this);
  if (Object.keys(attributes).length > 0) {
    props.attributes = attributes;
  }
  if (Object.keys(classes).length > 0) {
    props.classList = classes;
  }
  if (Object.keys(style).length > 0) {
    props.style = style;
  }

  const childNodes = this.childNodes;
  if (childNodes.length > 0) {
    props.childNodes = childNodes;
  }

  const observedAttributes = this.constructor.observedAttributes || [];
  observedAttributes.forEach(attribute => {
    props[attribute] = this[attribute]
  });

  return props;
}


/**
 * @param {Element} element
 * @returns {any}
 */
export function current(element) {
  return element instanceof HTMLElement ?
    {
      attributes: currentAttributes(element),
      classes: currentClasses(element),
      style: currentStyle(element)
    } :
    {
      attributes: currentAttributes(element),
      classes: currentClasses(element),
    };
}


/**
 * @param {Element} element
 * @returns {any}
 */
export function currentAttributes(element) {
  const attributes = {};
  Array.prototype.forEach.call(element.attributes, attribute => {
    // TODO: Convert custom attributes to properties
    if (attribute.name !== 'class' && attribute.name !== 'style') {
      attributes[attribute.name] = attribute.value;
    }
  });
  return attributes;
}


/**
 * @param {Element} element
 * @returns {any}
 */
export function currentClasses(element) {
  const result = {};
  Array.prototype.forEach.call(element.classList, className =>
    result[className] = true
  );
  return result;
}


/**
 * @param {HTMLElement|SVGElement} element
 * @returns {any}
 */
export function currentStyle(element) {
  const styleProps = {};
  Array.prototype.forEach.call(element.style, key => {
    styleProps[key] = element.style[key];
  });
  return styleProps;
}
