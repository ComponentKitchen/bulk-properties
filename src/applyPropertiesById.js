import applyProperties from './applyProperties.js';


export default function applyPropertiesById(root, map) {
  for (const id in map) {
    const element = root.getElementById(id);
    if (element) {
      applyProperties(element, map[id]);
    } else {
      throw `Tried to apply properties to an element with id "${id}", but no element exists with that id.`;
    }
  }
}
