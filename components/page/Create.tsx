import React from "react";
import { LoadingOverlay } from "@mantine/core";
import { CreateProps, SaveButtonProps } from "@refinedev/mantine";
import { CreatePageProvider } from "./Create/CreatePageProvider";
import { CreateHeader } from "./Create/CreateHeader";
import { CreateFooter } from "./Create/CreateFooter";

export const Create: React.FC<CreateProps> & {
  Header: typeof CreateHeader;
  Footer: typeof CreateFooter;
} = (props) => {
  const {
    children,
    saveButtonProps: saveButtonPropsFromProps,
    isLoading,
  } = props;

  const saveButtonProps: SaveButtonProps = {
    ...(isLoading ? { disabled: true } : {}),
    ...saveButtonPropsFromProps,
  };

  const loadingOverlayVisible = isLoading ?? saveButtonProps?.disabled ?? false;

  return (
    <CreatePageProvider {...props}>
      <LoadingOverlay visible={loadingOverlayVisible} />
      {children}
    </CreatePageProvider>
  );
};

Create.Header = CreateHeader;
Create.Footer = CreateFooter;
