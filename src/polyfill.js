import applyProperties from './applyProperties.js';
import applyPropertiesToElements from './applyPropertiesToElements.js';


Element.prototype.applyProperties = function(props) {
  return applyProperties(this, props);
};

Document.prototype.applyPropertiesToElements = function(props) {
  return applyPropertiesToElements(this, props);
};
DocumentFragment.prototype.applyPropertiesToElements = function(props) {
  return applyPropertiesToElements(this, props);
};
