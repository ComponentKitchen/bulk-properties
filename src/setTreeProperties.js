import setProperties from './setProperties.js';


export default function setTreeProperties(root, treeProps) {
  for (const id in treeProps) {
    const element = root.querySelector(`#${id}`);
    if (element) {
      setProperties(element, treeProps[id]);
    }
  }
}
