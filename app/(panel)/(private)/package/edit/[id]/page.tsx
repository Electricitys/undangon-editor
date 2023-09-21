"use client";

import { PackageSchema } from "@/components/interfaces";
import { TextInput } from "@mantine/core";
import { yupResolver } from "@mantine/form";
import { HttpError } from "@refinedev/core";
import { Edit, useForm } from "@refinedev/mantine";
import * as Yup from "yup";

type PackageData = Pick<PackageSchema, "name" | "description" | "price">;

const schema = Yup.object().shape({
  name: Yup.string().min(2, "Name must have at least 3 letters"),
  description: Yup.number().required(),
  price: Yup.number().required(),
});

const PackageEdit: React.FC = () => {
  const { getInputProps, saveButtonProps } = useForm<
    PackageSchema,
    HttpError,
    PackageData
  >({
    validate: yupResolver(schema),
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <TextInput mt="sm" label="Name" {...getInputProps("name")} />
      <TextInput
        mt="sm"
        label="Description"
        {...getInputProps("description")}
      />
      <TextInput mt="sm" label="Price" {...getInputProps("price")} />
    </Edit>
  );
};

export default PackageEdit;
