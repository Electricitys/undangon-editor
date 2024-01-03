import tinycolor from "tinycolor2";

const checkFormat = (
  color: string,
  format: string,
  showAlpha: boolean,
  stateColorAlpha?: number
) => {
  const tinyColor = tinycolor(color);
  let value: string;
  const alphaValue = stateColorAlpha || tinyColor.getAlpha() * 100;

  switch (format) {
    case "rgb":
      value = tinyColor.toRgbString();
      break;
    case "hsl":
      value = tinyColor.toHslString();
      break;
    case "hex":
      if (showAlpha && alphaValue !== 100) {
        value = tinyColor.toHex8String();
      } else {
        value = tinyColor.toHexString();
      }
      break;

    default:
      value = "";
      break;
  }

  return value;
};

export default checkFormat;
