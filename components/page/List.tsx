import React from "react";
import { Box, Card } from "@mantine/core";

import { ListProps } from "@refinedev/mantine";
import { ListProvider } from "./List/ListProvider";

export const List: React.FC<ListProps> = (props) => {
  const { children, wrapperProps, contentProps } = props;

  return (
    <ListProvider {...props}>
      <Card p="md" {...wrapperProps}>
        {children}
      </Card>
    </ListProvider>
  );
};
