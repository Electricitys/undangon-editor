"use client";

import { InvitationSchema } from "@/components/interfaces";
import { Button, Select, TextInput } from "@mantine/core";
import { HttpError } from "@refinedev/core";
import { Edit, useForm, useSelect } from "@refinedev/mantine";
import { IconEdit } from "@tabler/icons-react";
import React from "react";
import slugify from "slugify";

type InvitationData = Pick<
  InvitationSchema,
  "name" | "category_id" | "slug" | "package_id"
>;

const InvitationEdit: React.FC = () => {
  const {
    getInputProps,
    saveButtonProps,
    refineCore: { queryResult },
  } = useForm<InvitationSchema, HttpError, InvitationData>({
    initialValues: {
      name: "",
      slug: "",
      category_id: 0,
      package_id: 0,
    },
  });

  const invitationData = queryResult?.data?.data;

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
    return `/e/invitation/${
      invitationData && slugify(invitationData?.name)
    }/${invitationData?.id}`;
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
      <TextInput mt="sm" label="Name" {...getInputProps("name")} />
      <TextInput mt="sm" label="Slug" {...getInputProps("slug")} />
      <Select
        mt="sm"
        label="Category"
        {...getInputProps("category_id")}
        {...categorySelectProps}
        filterDataOnExactSearchMatch={false}
      />
      <Select
        mt="sm"
        label="Package"
        {...getInputProps("package_id")}
        {...packageSelectProps}
        filterDataOnExactSearchMatch={false}
      />
    </Edit>
  );
};

export default InvitationEdit;
