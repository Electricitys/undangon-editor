import rgbaToHex from "./rgbaToHex";

const isValidRgba = (rgba: Array<string | number>) => {
  return !!rgbaToHex(rgba);
};

export default isValidRgba;
