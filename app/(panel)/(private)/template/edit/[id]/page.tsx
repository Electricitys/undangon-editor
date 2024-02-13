"use client";

import { TemplateSchema } from "@/components/interfaces";
import { Edit } from "@/components/page/Edit";
import {
  AspectRatio,
  Button,
  Card,
  Group,
  Image,
  Select,
  TextInput,
} from "@mantine/core";
import { HttpError } from "@refinedev/core";
import { useForm, useSelect } from "@refinedev/mantine";
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
    values,
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

  const templateUrl = React.useMemo(() => {
    // const auth = feathers.get("authentication");
    return `/e/template/${templateData && slugify(templateData?.name)}/${
      templateData?.id
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
            Edit Template
          </Button>
        </>
      )}
    >
      <Card mb="sm">
        <Edit.Header />
      </Card>
      <Card mb="sm">
        <Group>
          <div style={{ flexGrow: 1 }}>
            <TextInput mt="sm" label="Name" {...getInputProps("name")} />
            <Select
              mt="sm"
              label="Category"
              {...getInputProps("category_id")}
              {...categorySelectProps}
              filterDataOnExactSearchMatch={false}
            />
          </div>
          <div>
            <Card style={{ width: 250 }} p={0} shadow="md" withBorder={true}>
              <AspectRatio ratio={1}>
                <Image
                  src={values.thumbnail_url}
                  alt={values.name}
                  withPlaceholder={true}
                />
              </AspectRatio>
            </Card>
          </div>
        </Group>
      </Card>
    </Edit>
  );
};

export default TemplateEdit;
