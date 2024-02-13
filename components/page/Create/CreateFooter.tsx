import { Group } from "@mantine/core";
import { useCreatePageContext } from "./CreatePageProvider";
import { SaveButton, SaveButtonProps } from "@refinedev/mantine";

export const CreateFooter = () => {
  const {
    saveButtonProps: saveButtonPropsFromProps,
    isLoading,
    footerButtons: footerButtonsFromProps,
    footerButtonProps,
  } = useCreatePageContext();

  const saveButtonProps: SaveButtonProps = {
    ...(isLoading ? { disabled: true } : {}),
    ...saveButtonPropsFromProps,
  };

  const defaultFooterButtons = <SaveButton {...saveButtonProps} />;

  const footerButtons = footerButtonsFromProps
    ? typeof footerButtonsFromProps === "function"
      ? footerButtonsFromProps({
          defaultButtons: defaultFooterButtons,
          saveButtonProps,
        })
      : footerButtonsFromProps
    : defaultFooterButtons;
  return (
    <Group position="right" spacing="xs" {...footerButtonProps}>
      {footerButtons}
    </Group>
  );
};
