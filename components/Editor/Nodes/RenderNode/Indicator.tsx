import { styled } from "@stitches/react";

export const IndicatorDiv = styled("div", {
  position: "fixed",
  zIndex: 49,

  alignItems: "center",
  marginTop: "-20px",
  fontSize: "10px",
  lineHeight: "10px",
  color: "white",
  height: "20px",

  svg: {
    fill: "#fff",
  },
});

export const IndicatorBorderDiv = styled("div", {
  zIndex: 49,
  position: "fixed",
  border: "1px dashed red",
  pointerEvents: "none",
});
