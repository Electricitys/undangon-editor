import React from "react";
import {
  Box,
  Card,
  Group,
  ActionIcon,
  Stack,
  Title,
  LoadingOverlay,
} from "@mantine/core";
import {
  useBack,
  useGo,
  useMutationMode,
  useNavigation,
  useRefineContext,
  useResource,
  useUserFriendlyName,
  useRouterType,
  useToPath,
  useTranslate,
} from "@refinedev/core";
import { IconArrowLeft } from "@tabler/icons-react";
import {
  DeleteButton,
  ListButton,
  RefreshButton,
  SaveButton,
  Breadcrumb,
  ListButtonProps,
  RefreshButtonProps,
  DeleteButtonProps,
  SaveButtonProps,
  AutoSaveIndicator,
  EditProps,
} from "@refinedev/mantine";
import { useEditPageContext } from "./EditPageProvider";

export const EditFooter = () => {
  const {
    resource: resourceFromProps,
    recordItemId,
    deleteButtonProps: deleteButtonPropsFromProps,
    mutationMode: mutationModeFromProps,
    saveButtonProps: saveButtonPropsFromProps,
    canDelete,
    dataProviderName,
    isLoading,
    footerButtons: footerButtonsFromProps,
    footerButtonProps,
  } = useEditPageContext();

  const { mutationMode: mutationModeContext } = useMutationMode();
  const mutationMode = mutationModeFromProps ?? mutationModeContext;

  const routerType = useRouterType();
  const go = useGo();
  const { list: legacyGoList } = useNavigation();

  const {
    resource,
    id: idFromParams,
    identifier,
  } = useResource(resourceFromProps);

  const goListPath = useToPath({
    resource,
    action: "list",
  });

  const id = recordItemId ?? idFromParams;

  const isDeleteButtonVisible =
    canDelete ??
    ((resource?.meta?.canDelete ?? resource?.canDelete) ||
      deleteButtonPropsFromProps);

  const deleteButtonProps: DeleteButtonProps | undefined = isDeleteButtonVisible
    ? ({
        ...(isLoading ? { disabled: true } : {}),
        resource: routerType === "legacy" ? resource?.route : identifier,
        mutationMode,
        onSuccess: () => {
          if (routerType === "legacy") {
            legacyGoList(resource?.route ?? resource?.name ?? "");
          } else {
            go({ to: goListPath });
          }
        },
        recordItemId: id,
        dataProviderName,
        ...deleteButtonPropsFromProps,
      } as const)
    : undefined;

  const saveButtonProps: SaveButtonProps = {
    ...(isLoading ? { disabled: true } : {}),
    ...saveButtonPropsFromProps,
  };

  const defaultFooterButtons = (
    <>
      {isDeleteButtonVisible && <DeleteButton {...deleteButtonProps} />}
      <SaveButton {...saveButtonProps} />
    </>
  );

  const footerButtons = footerButtonsFromProps
    ? typeof footerButtonsFromProps === "function"
      ? footerButtonsFromProps({
          defaultButtons: defaultFooterButtons,
          deleteButtonProps,
          saveButtonProps,
        })
      : footerButtonsFromProps
    : defaultFooterButtons;

  return (
    <Group position="right" spacing="xs" mt="md" {...footerButtonProps}>
      {footerButtons}
    </Group>
  );
};
