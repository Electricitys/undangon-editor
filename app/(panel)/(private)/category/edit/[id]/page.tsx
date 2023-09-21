"use client";

import { CategorySchema } from "@/components/interfaces";
import { TextInput } from "@mantine/core";
import { HttpError } from "@refinedev/core";
import { Edit, useForm } from "@refinedev/mantine";

type CategoryData = Pick<CategorySchema, "name">;

const CategoryEdit: React.FC = () => {
  const { getInputProps, saveButtonProps } = useForm<
    CategorySchema,
    HttpError,
    CategoryData
  >({
    initialValues: {
      name: "",
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <TextInput mt="sm" label="Name" {...getInputProps("name")} />
    </Edit>
  );
};

export default CategoryEdit;
