"use client";

import { TemplateSchema } from "@/components/interfaces";
import { Button, Select, TextInput } from "@mantine/core";
import { HttpError } from "@refinedev/core";
import { Edit, useForm, useSelect } from "@refinedev/mantine";
import { IconEdit } from "@tabler/icons-react";
import slugify from "slugify";

type TemplateData = Pick<
  TemplateSchema,
  "name" | "category_id" | "thumbnail_url"
>;

const TemplateEdit: React.FC = () => {
  const {
    getInputProps,
    saveButtonProps,
    refineCore: { queryResult },
  } = useForm<TemplateSchema, HttpError, TemplateData>({
    initialValues: {
      name: "",
      category_id: 0,
      thumbnail_url: "",
    },
  });

  const templateData = queryResult?.data?.data;

  const { selectProps: categorySelectProps } = useSelect({
    resource: "categories",
    defaultValue: templateData?.category_id,
    optionLabel: "name",
  });

  return (
    <Edit
      saveButtonProps={saveButtonProps}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <Button
            target="_blank"
            component="a"
            href={`http://localhost:3001/e/${
              templateData && slugify(templateData?.name)
            }/${templateData?.id}`}
            variant="outline"
            size="sm"
            leftIcon={<IconEdit size={18} />}
          >
            Edit Template
          </Button>
        </>
      )}
    >
      <TextInput mt="sm" label="Name" {...getInputProps("name")} />
      <Select
        mt="sm"
        label="Category"
        {...getInputProps("category_id")}
        {...categorySelectProps}
        filterDataOnExactSearchMatch={false}
      />
    </Edit>
  );
};

export default TemplateEdit;
