import { TransformProperties } from "./types";

export function toCssTransform(
  transformProperties: TransformProperties
): string {
  let cssTransform = "";

  for (let [key, value] of Object.entries(transformProperties)) {
    if (value) {
      if (
        [
          "translateX",
          "translateY",
          "translateZ",
          "rotate",
          "scaleX",
          "scaleY",
          "originX",
          "orginY",
        ].indexOf(key) > -1
      ) {
        cssTransform += `${key}(${value ?? 0})`;
      }
    }
  }

  return cssTransform.trim();
}
