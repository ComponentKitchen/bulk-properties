export const booleanAttributes = {
  checked: true,
  defer: true,
  disabled: true,
  hidden: true,
  ismap: true,
  multiple: true,
  noresize: true,
  readonly: true,
  selected: true
};


const previousChildNodesMap = new WeakMap();


/**
 * @param {Element} element 
 * @param {object} props
 */
export default function setProperties(element, props) {
  for (const key in props) {
    const value = props[key];
    switch (key) {

      case 'attributes':
        applyAttributes(element, value);
        break;

      case 'childNodes':
        applyChildNodes(element, value);
        break;

      case 'classList':
        applyClassList(element, value);
        break;

      case 'style':
        if (element instanceof HTMLElement || element instanceof SVGElement) {
          applyStyle(element, value);
        }
        break;

      default:
        // Update property
        element[key] = value;
        break;
    }
  }
}


/**
 * @param {Element} element 
 * @param {string} name 
 * @param {string|boolean|null} value 
 */
export function applyAttribute(element, name, value) {
  const existingValue = element.getAttribute(name);
  if (booleanAttributes[name]) {
    // Boolean attribute
    const changed = (existingValue === null) === value;
    if (changed) {
      if (value) {
        element.setAttribute(name, '');
      } else {
        element.removeAttribute(name);
      }
    }
  } else if (existingValue !== value) {
    // Regular string-valued attribute
    if (value !== null) {
      element.setAttribute(name, value.toString());
    } else {
      element.removeAttribute(name);
    }
  }
}


/**
 * @param {Element} element 
 * @param {any} attributeProps
 */
export function applyAttributes(element, attributeProps) {
  if (attributeProps) {
    for (const attributeName in attributeProps) {
      applyAttribute(element, attributeName, attributeProps[attributeName]);
    }
  }
}


/**
 * @param {Element} element 
 * @param {NodeList|Node[]} childNodes
 */
export function applyChildNodes(element, childNodes) {
  // Quick dirty check if last array applied was frozen.
  if (childNodes === previousChildNodesMap.get(element)) {
    return;
  }

  const oldLength = element.childNodes.length;
  const newLength = childNodes.length;
  const length = Math.max(oldLength, newLength);
  for (let i = 0; i < length; i++) {
    const oldChild = element.childNodes[i];
    const newChild = childNodes[i];
    if (i < oldLength && i < newLength && oldChild !== newChild) {
      element.replaceChild(newChild, oldChild);
    } else if (i >= oldLength) {
      element.appendChild(newChild);
    } else if (i >= newLength) {
      element.removeChild(oldChild);
    }
  }

  if (Object.isFrozen(childNodes)) {
    previousChildNodesMap.set(element, childNodes);
  }
}


/**
 * @param {Element} element 
 * @param {any} classProps
 */
export function applyClassList(element, classProps) {
  for (const className in classProps) {
    element.classList.toggle(className, classProps[className]);
  }
}


/**
 * @param {HTMLElement|SVGElement} element 
 * @param {any} styleProps
 */
export function applyStyle(element, styleProps) {
  const style = element.style;
  for (const styleName in styleProps) {
    const value = styleProps[styleName];
    style[styleName] = value === undefined ? '' : value;
  }
}
