import { IconProps } from "@radix-ui/react-icons/dist/types";
import * as React from "react";

export const PaddingRightIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12 0v12h-1V0h1zM3 3h6v6H3V3zm1 1v4h4V4H4z"
          fillRule="evenodd"
          fillOpacity="1"
          fill={color}
          stroke="none"
        ></path>
      </svg>
    );
  }
);

PaddingRightIcon.displayName = "PaddingRightIcon";

export default PaddingRightIcon;
