"use client";

import { LoadingOverlay } from "@mantine/core";

const Loading = () => {
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 100,
        inset: 0,
      }}
    >
      <div>LOADING</div>
      <LoadingOverlay visible={true} />;
    </div>
  );
};

export default Loading;
