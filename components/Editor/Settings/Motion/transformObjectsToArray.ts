export function transformObjectsToArray(array: { [key: string]: any }[]): {
  [key: string]: (number | null)[];
} {
  // Step 1: Extract keys from all objects and find unique keys
  let keys = [...new Set(array.flatMap((obj) => Object.keys(obj)))];

  // Step 2: Initialize result object with arrays filled with null values
  let result: { [key: string]: (number | null)[] } = {};
  keys.forEach((key) => {
    result[key] = Array(array.length).fill(null);
  });

  // Step 3: Fill in the arrays with values
  array.forEach((obj, index) => {
    keys.forEach((key) => {
      if (obj.hasOwnProperty(key)) {
        result[key][index] = obj[key];
      }
    });
  });

  return result;
}
