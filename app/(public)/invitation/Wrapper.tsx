"use client";

import { RefineThemes } from "@refinedev/mantine";
import { Global, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import React from "react";

export default function Wrapper({ children }: React.PropsWithChildren) {
  return (
    <MantineProvider
      theme={{ ...RefineThemes.Blue }}
      withNormalizeCSS
      withGlobalStyles
    >
      <Global styles={{ body: { WebkitFontSmoothing: "auto" } }} />
      <NotificationsProvider position="top-right">
        {children}
      </NotificationsProvider>
    </MantineProvider>
  );
}
