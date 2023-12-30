import { CSSUnitValue, uncss } from "@/components/ui/css_unit_input";

type Viewport = {
  height: number;
  width: number;
};

export const ProcessUnitForViewport = (
  raw: string,
  viewport: Viewport
) => {
  if (!raw) return raw;
  const { unit, value } = uncss.parse(raw);
  if (["vh", "vw"].indexOf(unit) > -1) {
    return (
      (value / 100) * (unit === "vh" ? viewport["height"] : viewport["width"])
    );
  }
  return raw;
};
