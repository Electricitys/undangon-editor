// https://stackoverflow.com/a/59398737

export const swapArrayLocs = (arr: any, index1: any, index2: any) => {
  [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
};
