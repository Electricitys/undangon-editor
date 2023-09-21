"use client";

import { Authenticated } from "@refinedev/core";
import { ThemedLayoutV2 } from "@refinedev/mantine";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    <Authenticated redirectOnFail="/login">
      <ThemedLayoutV2>{children}</ThemedLayoutV2>
    </Authenticated>
  );
}
