"use client";

import {
  AuthenticationResponse,
  TemplateSchema,
} from "@/components/interfaces";
import { Button, Select, TextInput } from "@mantine/core";
import { HttpError, useGetIdentity } from "@refinedev/core";
import { Edit, useForm, useSelect } from "@refinedev/mantine";
import { IconEdit } from "@tabler/icons-react";
import React from "react";
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

  const { data } = useGetIdentity<AuthenticationResponse>();

  const templateData = queryResult?.data?.data;

  const { selectProps: categorySelectProps } = useSelect({
    resource: "categories",
    defaultValue: templateData?.category_id,
    optionLabel: "name",
  });

  const templateUrl = React.useMemo(() => {
    // const auth = feathers.get("authentication");
    return `http://localhost:3001/e/${
      templateData && slugify(templateData?.name)
    }/${templateData?.id}`;
  }, [queryResult, data]);

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
