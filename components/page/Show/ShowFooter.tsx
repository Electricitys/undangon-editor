import { ShowProps } from "@refinedev/mantine";
import { useShowPageContext } from "./ShowPageProvider";
import { Group } from "@mantine/core";

export const ShowFooter: React.FC<ShowProps> = () => {
  const { footerButtons: footerButtonsFromProps, footerButtonProps } =
    useShowPageContext();

  const footerButtons = footerButtonsFromProps
    ? typeof footerButtonsFromProps === "function"
      ? footerButtonsFromProps({ defaultButtons: null })
      : footerButtonsFromProps
    : null;

  return (
    <Group position="right" spacing="xs" mt="md" {...footerButtonProps}>
      {footerButtons}
    </Group>
  );
};
