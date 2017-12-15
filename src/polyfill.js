import applyProperties from './applyProperties.js';
import applyPropertiesById from './applyPropertiesById.js';


const original = {
  createElement: document.createElement,
  createElementNS: document.createElementNS
};


Element.prototype.applyProperties = function(props) {
  return applyProperties(this, props);
};

Object.assign(document, {

  applyPropertiesById: function(props) {
    return applyPropertiesById(this, props);
  },

  createElement: function(tagName, props) {
    const element = original.createElement.call(this, tagName);
    element.applyProperties(props);
    return element;
  },

  createElementNS: function(tagName, props) {
    const element = original.createElementNS.call(this, tagName);
    element.applyProperties(props);
    return element;
  }

});

DocumentFragment.prototype.applyPropertiesById = function(props) {
  return applyPropertiesById(this, props);
};
