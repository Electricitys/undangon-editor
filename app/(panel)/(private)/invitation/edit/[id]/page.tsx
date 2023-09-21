"use client";

import { InvitationSchema } from "@/components/interfaces";
import { Select, TextInput } from "@mantine/core";
import { HttpError } from "@refinedev/core";
import { Edit, useForm, useSelect } from "@refinedev/mantine";

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

  return (
    <Edit saveButtonProps={saveButtonProps}>
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
