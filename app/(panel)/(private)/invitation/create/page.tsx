"use client";

import { InvitationSchema } from "@/components/interfaces";
import { yupResolver } from "@/components/utils/mantineYupResolver";
import { ActionIcon, Box, Divider, Select, TextInput } from "@mantine/core";
import { HttpError } from "@refinedev/core";
import { Create, useForm, useSelect } from "@refinedev/mantine";
import { ArrowUpDownIcon } from "lucide-react";
import slugify from "slugify";
import * as Yup from "yup";

interface InvitationData
  extends Partial<
    Pick<
      InvitationSchema,
      "name" | "category_id" | "slug" | "package_id" | "content"
    >
  > {}

const Schema = Yup.object().shape({
  name: Yup.string().required(),
  slug: Yup.string().required(),
  category_id: Yup.number().required("Category is required"),
  package_id: Yup.number().required("Package is required "),
  content: Yup.string().required(),
});

const InvitationCreate: React.FC = () => {
  const { getInputProps, saveButtonProps, setFieldValue, values } = useForm<
    InvitationSchema,
    HttpError,
    InvitationData
  >({
    initialValues: {
      name: undefined,
      slug: undefined,
      category_id: undefined,
      package_id: undefined,
      content: " ",
    },
    transformValues(values: any) {
      delete values["template_id"];
      return values;
    },
    validate: yupResolver(Schema),
  });

  const { selectProps: categorySelectProps } = useSelect({
    resource: "categories",
    optionLabel: "name",
  });
  const { selectProps: packageSelectProps } = useSelect({
    resource: "packages",
    optionLabel: "name",
  });
  const { selectProps: templateSelectProps } = useSelect({
    resource: "templates",
    optionLabel: "name",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <TextInput mt="sm" label="Name" {...getInputProps("name")} />
      <TextInput
        mt="sm"
        label="Slug"
        description="The slug is used to identify the invitation."
        {...getInputProps("slug")}
        rightSection={
          <ActionIcon
            onClick={() => {
              values["name"] &&
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
        description="The category is used to group invitations."
        {...categorySelectProps}
        {...getInputProps("category_id")}
        filterDataOnExactSearchMatch={false}
      />
      <Select
        mt="sm"
        label="Package"
        withinPortal
        description="The package is used to this invitation."
        {...packageSelectProps}
        {...getInputProps("package_id")}
        filterDataOnExactSearchMatch={false}
      />
      <Divider mt="xl" mx="-md" />
      <Box>
        <Select
          mt="sm"
          label="Template"
          withinPortal
          description="The template is used to generate the invitation."
          {...getInputProps("template_id")}
          {...templateSelectProps}
          filterDataOnExactSearchMatch={false}
        />
      </Box>
    </Create>
  );
};

export default InvitationCreate;
