"use client";

import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router/app";
import { DocumentTitleHandler } from "@refinedev/nextjs-router";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { NotificationsProvider } from "@mantine/notifications";
import { RefineThemes } from "@refinedev/mantine";
import { MantineProvider, Global } from "@mantine/core";

import {
  IconCategory,
  IconFileDelta,
  IconFileDollar,
  IconTemplate,
  IconUsers,
} from "@tabler/icons-react";
import { dataProvider } from "@/components/provider";
import { authProvider } from "@/components/provider/authProvider";
import { canHandler } from "@/components/provider/accessControl";
import { PuzzleIcon } from "lucide-react";
import { notificationProvider } from "@refinedev/mantine";
import { Analytics } from "@/components/component/Analytics";

export default function RootLayout(props: React.PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <Analytics />
      </head>
      <body>
        <RefineKbarProvider>
          <MantineProvider
            theme={{ ...RefineThemes.Blue }}
            withNormalizeCSS
            withGlobalStyles
          >
            <Global styles={{ body: { WebkitFontSmoothing: "auto" } }} />
            <NotificationsProvider position="top-right">
              <Refine
                authProvider={authProvider}
                dataProvider={dataProvider()}
                routerProvider={routerProvider}
                notificationProvider={notificationProvider}
                accessControlProvider={{
                  can: canHandler,
                  options: {
                    buttons: {
                      enableAccessControl: true,
                      hideIfUnauthorized: true,
                    },
                  },
                }}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  disableTelemetry: true,
                  reactQuery: {
                    clientConfig: {
                      defaultOptions: {
                        queries: {
                          networkMode: "always" as any,
                        },
                        mutations: {
                          networkMode: "always" as any,
                        },
                      },
                    },
                  },
                }}
                resources={[
                  {
                    name: "categories",
                    list: "/categories",
                    show: "/category/:id",
                    create: "/category/create",
                    edit: "/category/edit/:id",
                    meta: {
                      icon: <IconCategory />,
                    },
                  },
                  {
                    name: "invitations",
                    list: "/invitations",
                    show: "/invitation/:id",
                    create: "/invitation/create",
                    edit: "/invitation/edit/:id",
                    meta: {
                      icon: <IconFileDelta />,
                    },
                  },
                  {
                    name: "templates",
                    list: "/templates",
                    show: "/template/:id",
                    create: "/template/create",
                    edit: "/template/edit/:id",
                    meta: {
                      icon: <IconTemplate />,
                    },
                  },
                  {
                    name: "presets",
                    list: "/presets",
                    show: "/preset/:id",
                    create: "/preset/create",
                    edit: "/preset/edit/:id",
                    meta: {
                      icon: <PuzzleIcon />,
                    },
                  },
                  {
                    name: "users",
                    list: "/users",
                    show: "/user/:id",
                    create: "/user/create",
                    edit: "/user/edit/:id",
                    meta: {
                      icon: <IconUsers />,
                    },
                  },
                  {
                    name: "packages",
                    list: "/packages",
                    show: "/package/:id",
                    create: "/package/create",
                    edit: "/package/edit/:id",
                    meta: {
                      icon: <IconFileDollar />,
                    },
                  },
                ]}
              >
                {/* We're defining `Layout` here but you might want to have different layouts per your page. */}
                {/* This is totally fine for refine, you can place your Layout wherever you like. */}
                {/* <Component {...pageProps} /> */}
                {props.children}
                <RefineKbar />
                <DocumentTitleHandler />
              </Refine>
            </NotificationsProvider>
          </MantineProvider>
        </RefineKbarProvider>
      </body>
    </html>
  );
}
