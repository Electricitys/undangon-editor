import { ActionIcon, Group, Stack, Title } from "@mantine/core";
import {
  useRouterType,
  useBack,
  useUserFriendlyName,
  useResource,
  useTranslate,
  useRefineContext,
  useNavigation,
} from "@refinedev/core";
import { Breadcrumb } from "@refinedev/mantine";
import { RefinePageHeaderClassNames } from "@refinedev/ui-types";
import { IconArrowLeft } from "@tabler/icons-react";
import { title } from "process";
import { useCreatePageContext } from "./CreatePageProvider";

export const CreateHeader = () => {
  const {
    resource: resourceFromProps,
    headerButtons: headerButtonsFromProps,
    headerButtonProps,
    headerProps,
    goBack: goBackFromProps,
    breadcrumb: breadcrumbFromProps,
    title,
  } = useCreatePageContext();

  const routerType = useRouterType();
  const back = useBack();
  const { goBack } = useNavigation();
  const getUserFriendlyName = useUserFriendlyName();

  const { resource, action, identifier } = useResource(resourceFromProps);

  const translate = useTranslate();
  const { options: { breadcrumb: globalBreadcrumb } = {} } = useRefineContext();

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

  const buttonBack =
    goBackFromProps === (false || null) ? null : (
      <ActionIcon
        onClick={
          action !== "list" || typeof action !== "undefined"
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
          defaultButtons: null,
        })
      : headerButtonsFromProps
    : null;
  return (
    <>
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
                  `${identifier}.titles.create`,
                  `Create ${getUserFriendlyName(
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
