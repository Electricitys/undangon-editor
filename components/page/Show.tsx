import React from "react";
import { Card, LoadingOverlay } from "@mantine/core";

import { ShowProps } from "@refinedev/mantine";
import { ShowPageProvider } from "./Show/ShowPageProvider";
import { ShowHeader } from "./Show/ShowHeader";
import { ShowFooter } from "./Show/ShowFooter";

export const Show: React.FC<ShowProps> & {
  Header: typeof ShowHeader;
  Footer: typeof ShowFooter;
} = (props) => {
  const { children, isLoading } = props;

  const loadingOverlayVisible = isLoading ?? false;

  return (
    <ShowPageProvider {...props}>
      <LoadingOverlay visible={loadingOverlayVisible} />
      {children}
    </ShowPageProvider>
  );
};

Show.Header = ShowHeader;
Show.Footer = ShowFooter;
