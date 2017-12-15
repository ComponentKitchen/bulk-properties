const booleanAttributes = {
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


/**
 * @param {Element} element 
 * @param {object} props
 */
export default function applyProperties(element, props) {
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
 * @param {string|boolean} value 
 */
function applyAttribute(element, name, value) {
  if (booleanAttributes[name]) {
    // Boolean attribute
    if (value) {
      element.setAttribute(name, '');
    } else {
      element.removeAttribute(name);
    }
  } else {
    // Regular string-valued attribute
    if (value !== null) {
      element.setAttribute(name, value);
    } else {
      element.removeAttribute(name);
    }
  }
}


/**
 * @param {Element} element 
 * @param {any} attributeProps
 */
function applyAttributes(element, attributeProps) {
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
function applyChildNodes(element, childNodes) {
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
}


/**
 * @param {Element} element 
 * @param {any} classProps
 */
function applyClassList(element, classProps) {
  for (const className in classProps) {
    element.classList.toggle(className, classProps[className]);
  }
}


/**
 * @param {HTMLElement|SVGElement} element 
 * @param {any} styleProps
 */
function applyStyle(element, styleProps) {
  Object.assign(element.style, styleProps);
}
