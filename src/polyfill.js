import applyProperties from './applyProperties.js';
import applyPropertiesById from './applyPropertiesById.js';


Element.prototype.applyProperties = function(props) {
  return applyProperties(this, props);
};

Document.prototype.applyPropertiesById = function(props) {
  return applyPropertiesById(this, props);
};
DocumentFragment.prototype.applyPropertiesById = function(props) {
  return applyPropertiesById(this, props);
};
