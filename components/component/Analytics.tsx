import React from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CONSTANTS } from "../Constants";

export const Analytics: React.FC = () => {
  return (
    <>
      <script
        defer
        src={`https://${CONSTANTS.UMAMI_URL}/script.js`}
        data-website-id={CONSTANTS.UMAMI_ID}
      ></script>
      <GoogleAnalytics gaId={CONSTANTS.GOOGLE_ANALYTICS_ID} />
    </>
  );
};
