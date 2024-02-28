import { useState } from "react";

import type { RefObject } from "react";

import { useEventListener } from "usehooks-ts";

export function useTap<T extends HTMLElement = HTMLElement>(
  elementRef: RefObject<T>
): boolean {
  const [value, setValue] = useState<boolean>(false);

  const handleMouseDown = () => {
    setValue(true);
  };
  const handleMouseUp = () => {
    setValue(false);
  };

  useEventListener("mousedown", handleMouseDown, elementRef);
  useEventListener("mouseup", handleMouseUp, elementRef);
  useEventListener("touchstart", handleMouseDown, elementRef);
  useEventListener("touchend", handleMouseUp, elementRef);

  return value;
}
