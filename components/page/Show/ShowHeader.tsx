import { ActionIcon, Group, Stack, Title } from "@mantine/core";
import {
  useBack,
  useGo,
  useNavigation,
  useRefineContext,
  useResource,
  useRouterType,
  useToPath,
  useTranslate,
  useUserFriendlyName,
} from "@refinedev/core";
import {
  Breadcrumb,
  DeleteButton,
  DeleteButtonProps,
  EditButton,
  EditButtonProps,
  ListButton,
  ListButtonProps,
  RefreshButton,
  RefreshButtonProps,
  ShowProps,
} from "@refinedev/mantine";
import { RefinePageHeaderClassNames } from "@refinedev/ui-types";
import { IconArrowLeft } from "@tabler/icons-react";
import { title } from "process";
import { useShowPageContext } from "./ShowPageProvider";

export const ShowHeader: React.FC<ShowProps> = () => {
  const {
    resource: resourceFromProps,
    recordItemId,
    canDelete,
    canEdit,
    dataProviderName,
    isLoading,
    headerButtons: headerButtonsFromProps,
    headerButtonProps,
    headerProps,
    goBack: goBackFromProps,
    breadcrumb: breadcrumbFromProps,
    title,
  } = useShowPageContext();

  const translate = useTranslate();
  const { options: { breadcrumb: globalBreadcrumb } = {} } = useRefineContext();

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

  const goListPath = useToPath({
    resource,
    action: "list",
  });

  const id = recordItemId ?? idFromParams;

  const breadcrumb =
    typeof breadcrumbFromProps === "undefined"
      ? globalBreadcrumb
      : breadcrumbFromProps;

  const breadcrumbComponent =
    typeof breadcrumb !== "undefined" ? (
      <>{breadcrumb}</> ?? undefined
    ) : (
      <Breadcrumb />
    );

  const hasList = resource?.list && !recordItemId;
  const isDeleteButtonVisible =
    canDelete ?? resource?.meta?.canDelete ?? resource?.canDelete;
  const isEditButtonVisible = canEdit ?? resource?.canEdit ?? !!resource?.edit;

  const listButtonProps: ListButtonProps | undefined = hasList
    ? {
        ...(isLoading ? { disabled: true } : {}),
        resource: routerType === "legacy" ? resource?.route : identifier,
      }
    : undefined;
  const editButtonProps: EditButtonProps | undefined = isEditButtonVisible
    ? {
        ...(isLoading ? { disabled: true } : {}),
        color: "primary",
        variant: "filled",
        resource: routerType === "legacy" ? resource?.route : identifier,
        recordItemId: id,
      }
    : undefined;
  const deleteButtonProps: DeleteButtonProps | undefined = isDeleteButtonVisible
    ? {
        ...(isLoading ? { disabled: true } : {}),
        resource: routerType === "legacy" ? resource?.route : identifier,
        recordItemId: id,
        onSuccess: () => {
          if (routerType === "legacy") {
            legacyGoList(resource?.route ?? resource?.name ?? "");
          } else {
            go({ to: goListPath });
          }
        },
        dataProviderName,
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
      {hasList && <ListButton {...listButtonProps} />}
      {isEditButtonVisible && <EditButton {...editButtonProps} />}
      {isDeleteButtonVisible && <DeleteButton {...deleteButtonProps} />}
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
          deleteButtonProps,
          editButtonProps,
          listButtonProps,
          refreshButtonProps,
        })
      : headerButtonsFromProps
    : defaultHeaderButtons;
  return (
    <Group position="apart" align="center" {...headerProps}>
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
                `${identifier}.titles.show`,
                `Show ${getUserFriendlyName(
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
  );
};
