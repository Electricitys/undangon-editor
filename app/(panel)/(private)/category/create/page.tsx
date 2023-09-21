"use client";

import { CategorySchema } from "@/components/interfaces";
import { TextInput } from "@mantine/core";
import { HttpError } from "@refinedev/core";
import { Create, useForm } from "@refinedev/mantine";

type CategoryData = Pick<CategorySchema, "name">;

const CategoryCreate: React.FC = () => {
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
    <Create saveButtonProps={saveButtonProps}>
      <TextInput mt="sm" label="Name" {...getInputProps("name")} />
    </Create>
  );
};

export default CategoryCreate;
