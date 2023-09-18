import { IconProps } from "@radix-ui/react-icons/dist/types";
import * as React from "react";

export const PaddingVerticalIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, forwardedRef) => {
    return (
      <svg
        width="15"
        height="15"
        viewBox="0 0 12 12"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        ref={forwardedRef}
      >
        <path
          d="M3 3h6v6H3V3zm1 1v4h4V4H4zm8 8H0v-1h12v1zm0-11H0V0h12v1z"
          fillRule="evenodd"
          fillOpacity="1"
          fill={color}
          stroke="none"
        ></path>
      </svg>
    );
  }
);

PaddingVerticalIcon.displayName = "PaddingVerticalIcon";

export default PaddingVerticalIcon;
