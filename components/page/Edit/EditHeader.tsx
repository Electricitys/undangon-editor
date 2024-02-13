import React from "react";
import { Group, ActionIcon, Stack, Title } from "@mantine/core";
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
} from "@refinedev/mantine";
import { RefinePageHeaderClassNames } from "@refinedev/ui-types";
import { useEditPageContext } from "./EditPageProvider";

export const EditHeader = () => {
  const {
    resource: resourceFromProps,
    recordItemId,
    deleteButtonProps: deleteButtonPropsFromProps,
    mutationMode: mutationModeFromProps,
    saveButtonProps: saveButtonPropsFromProps,
    canDelete,
    dataProviderName,
    isLoading,
    headerButtons: headerButtonsFromProps,
    headerButtonProps,
    headerProps,
    goBack: goBackFromProps,
    breadcrumb: breadcrumbFromProps,
    title,
    autoSaveProps,
  } = useEditPageContext();

  const translate = useTranslate();
  const { options: { breadcrumb: globalBreadcrumb } = {} } = useRefineContext();
  const { mutationMode: mutationModeContext } = useMutationMode();
  const mutationMode = mutationModeFromProps ?? mutationModeContext;

  const routerType = useRouterType();
  const back = useBack();
  const go = useGo();
  const { goBack, list: legacyGoList } = useNavigation();
  const getUserFriendlyName = useUserFriendlyName();

  const {
    resource,
    action,
    id: idFromParams,
    identifier,
  } = useResource(resourceFromProps);

  const id = recordItemId ?? idFromParams;

  const breadcrumb =
    typeof breadcrumbFromProps === "undefined"
      ? globalBreadcrumb
      : breadcrumbFromProps;

  const hasList = resource?.list && !recordItemId;

  const breadcrumbComponent =
    typeof breadcrumb !== "undefined" ? (
      <>{breadcrumb}</> ?? undefined
    ) : (
      <Breadcrumb />
    );

  const listButtonProps: ListButtonProps | undefined = hasList
    ? {
        ...(isLoading ? { disabled: true } : {}),
        resource: routerType === "legacy" ? resource?.route : identifier,
      }
    : undefined;

  const refreshButtonProps: RefreshButtonProps = {
    ...(isLoading ? { disabled: true } : {}),
    resource: routerType === "legacy" ? resource?.route : identifier,
    recordItemId: id,
    dataProviderName,
  };

  const defaultHeaderButtons = (
    <>
      {autoSaveProps && <AutoSaveIndicator {...autoSaveProps} />}
      {hasList && <ListButton {...listButtonProps} />}
      <RefreshButton {...refreshButtonProps} />
    </>
  );

  const buttonBack =
    goBackFromProps === (false || null) ? null : (
      <ActionIcon
        onClick={
          action !== "list" && typeof action !== "undefined"
            ? routerType === "legacy"
              ? goBack
              : back
            : undefined
        }
      >
        {typeof goBackFromProps !== "undefined" ? (
          goBackFromProps
        ) : (
          <IconArrowLeft />
        )}
      </ActionIcon>
    );

  const headerButtons = headerButtonsFromProps
    ? typeof headerButtonsFromProps === "function"
      ? headerButtonsFromProps({
          defaultButtons: defaultHeaderButtons,
          listButtonProps,
          refreshButtonProps,
        })
      : headerButtonsFromProps
    : defaultHeaderButtons;

  return (
    <>
      <Group position="apart" {...headerProps}>
        <Stack spacing="xs">
          {breadcrumbComponent}
          <Group spacing="xs">
            {buttonBack}
            {title ?? (
              <Title
                order={3}
                transform="capitalize"
                className={RefinePageHeaderClassNames.Title}
              >
                {translate(
                  `${identifier}.titles.edit`,
                  `Edit ${getUserFriendlyName(
                    resource?.meta?.label ??
                      resource?.options?.label ??
                      resource?.label ??
                      identifier,
                    "singular"
                  )}`
                )}
              </Title>
            )}
          </Group>
        </Stack>
        <Group spacing="xs" {...headerButtonProps}>
          {headerButtons}
        </Group>
      </Group>
    </>
  );
};
