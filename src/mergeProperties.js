

export const mergedProperties = {
  'attributes': true,
  'classList': true,
  'style': true
};


/**
 * @param {any[]} sources
 * @returns {any}
 */
export function merge(...sources) {
  const result = {};
  sources.forEach(source => {
    if (source) {
      for (const key in source) {
        const value = source[key];
        if (!mergedProperties[key]) {
          // Regular property overwrites existing value.
          result[key] = value;
        } else if (key === '$') {
          // Subelement updates requires deep (recursive) merge.
          result[key] = mergeSubelementUpdates(result[key], value);
        } else if (result[key]) {
          // Other special property requires shallow merge.
          result[key] = Object.assign({}, result[key], value);
        } else {
          // Key doesn't exist on result yet, no need to merge.
          result[key] = value;
        }
      }
    }
  })
  return result;
}


/*
 * Return the merger of two sets of `$` updates for subelements, where each
 * set is like { subelement1: {...updates}, subelement2: {...updates}, ...}.
 * 
 * Given
 * 
 *   { foo: { style: { background: 'black', color: 'gray' }}}
 * 
 * and 
 * 
 *   { foo: { style: { color: 'red' }}}
 * 
 * This returns
 * 
 *   { foo: { style: { background: 'black', color: 'red' }}}
 */
function mergeSubelementUpdates(updates1, updates2) {
  const result = Object.assign({}, updates1);
  for (const element in updates2) {
    result[element] = result[element] ?

      // Merge subelement updates.
      merge(result[element], updates2[element]) :

      // Subelement only exists on updates2, so no need to merge.
      updates2[element];
  }
  return result;
}
