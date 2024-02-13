"use client";

import { InvitationSchema } from "@/components/interfaces";
import { Edit } from "@/components/page/Edit";
import { Button, Card, Group, Select, TextInput } from "@mantine/core";
import { HttpError, useOne, useResource } from "@refinedev/core";
import { SaveButton, useForm, useSelect } from "@refinedev/mantine";
import { IconDeviceFloppy, IconEdit } from "@tabler/icons-react";
import React from "react";
import slugify from "slugify";
import { MetadataForm } from "./MetadataForm";

type InvitationData = Pick<
  InvitationSchema,
  "name" | "category_id" | "slug" | "package_id"
>;

const InvitationEdit: React.FC = () => {
  const {
    getInputProps,
    saveButtonProps,
    isDirty,
    values,
    refineCore: { queryResult, onFinish },
  } = useForm<InvitationSchema, HttpError, InvitationData>({
    initialValues: {
      name: "",
      slug: "",
      category_id: 0,
      package_id: 0,
    },
    refineCoreProps: {
      redirect: false,
    },
  });

  const handleSubmit = async () => {
    await onFinish(values);
  };

  const invitationData = queryResult?.data?.data as InvitationSchema;

  const { selectProps: categorySelectProps } = useSelect({
    resource: "categories",
    defaultValue: invitationData?.category_id,
    optionLabel: "name",
  });
  const { selectProps: packageSelectProps } = useSelect({
    resource: "packages",
    defaultValue: invitationData?.package_id,
    optionLabel: "name",
  });

  const templateUrl = React.useMemo(() => {
    // const auth = feathers.get("authentication");
    return `/e/invitation/${invitationData && slugify(invitationData?.slug)}/${
      invitationData?.id
    }`;
  }, [queryResult]);

  return (
    <Edit
      saveButtonProps={saveButtonProps}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <Button
            component="a"
            href={templateUrl}
            variant="outline"
            size="sm"
            leftIcon={<IconEdit size={18} />}
          >
            Edit Invitation
          </Button>
        </>
      )}
    >
      <Card mb="sm">
        <Edit.Header />
        <TextInput mt="sm" label="Name" {...getInputProps("name")} />
        <TextInput mt="sm" label="Slug" {...getInputProps("slug")} />
        <Select
          mt="sm"
          label="Category"
          withinPortal
          {...getInputProps("category_id")}
          {...categorySelectProps}
          filterDataOnExactSearchMatch={false}
        />
        <Select
          mt="sm"
          label="Package"
          withinPortal
          {...getInputProps("package_id")}
          {...packageSelectProps}
          filterDataOnExactSearchMatch={false}
        />
        <Group position="right">
          <Button
            type="button"
            mt="md"
            disabled={!isDirty()}
            onClick={handleSubmit}
            leftIcon={<IconDeviceFloppy size={18} />}
          >
            Save
          </Button>
        </Group>
      </Card>
      <Card mb="sm">
        {invitationData?.metadata_id && (
          <MetadataForm id={invitationData.metadata_id} />
        )}
      </Card>
    </Edit>
  );
};

export default InvitationEdit;
