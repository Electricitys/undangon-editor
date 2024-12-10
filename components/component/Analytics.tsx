import React from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

export const Analytics: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <script
        defer
        src="https://analytics-umami-686f9c-192-168-1-13.185131101.xyz/script.js"
        data-website-id="a187c3a5-c4f4-4282-833a-4ecf6d49908a"
      ></script>
      <GoogleAnalytics gaId="G-Q29Q1QRVTP" />
    </>
  );
};
