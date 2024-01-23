"use client";

import { InvitationSchema } from "@/components/interfaces";
import { ActionIcon, Select, TextInput } from "@mantine/core";
import { HttpError } from "@refinedev/core";
import { Create, useForm, useSelect } from "@refinedev/mantine";
import { ArrowUpDownIcon } from "lucide-react";
import slugify from "slugify";

type InvitationData = Pick<
  InvitationSchema,
  "name" | "category_id" | "slug" | "package_id" | "content"
>;

const InvitationCreate: React.FC = () => {
  const { getInputProps, saveButtonProps, setFieldValue, values } = useForm<
    InvitationSchema,
    HttpError,
    InvitationData
  >({
    initialValues: {
      name: "",
      slug: "",
      category_id: 0,
      package_id: 0,
      content: " ",
    },
  });

  const { selectProps: categorySelectProps } = useSelect({
    resource: "categories",
    optionLabel: "name",
  });
  const { selectProps: packageSelectProps } = useSelect({
    resource: "packages",
    optionLabel: "name",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <TextInput mt="sm" label="Name" {...getInputProps("name")} />
      <TextInput
        mt="sm"
        label="Slug"
        {...getInputProps("slug")}
        rightSection={
          <ActionIcon
            onClick={() => {
              setFieldValue("slug", slugify(values["name"], { lower: true }));
            }}
          >
            <ArrowUpDownIcon size={16} />
          </ActionIcon>
        }
      />
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
    </Create>
  );
};

export default InvitationCreate;
