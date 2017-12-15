// import getProperties from './getProperties.js';
// import mergeProperties from './mergeProperties.js';
import setProperties from './setProperties.js';
import setTreeProperties from './setTreeProperties.js';
// import updateProperties from './updateProperties.js';


// Element.prototype.getProperties = function() {
//   return getProperties(this);
// };

Element.prototype.setProperties = function(props) {
  return setProperties(this, props);
};

Element.prototype.setTreeProperties = function(props) {
  return setTreeProperties(this, props);
};

// Element.prototype.updateProperties = function(props) {
//   return updateProperties(this, props);
// };

// window.mergeProperties = function(props1, props2) {
//   return mergeProperties(props1, props2);
// };
