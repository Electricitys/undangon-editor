"use client";

import { PresetSchema, PresetTypeSchema } from "@/components/interfaces";
import { Select, TextInput } from "@mantine/core";
import { yupResolver } from "@mantine/form";
import { HttpError } from "@refinedev/core";
import { Create, useForm, useSelect } from "@refinedev/mantine";
import * as Yup from "yup";

const schema = Yup.object().shape({
  name: Yup.string().min(2, "Name must have at least 3 letters"),
  category_id: Yup.number().required(),
});

const PresetCreate: React.FC = () => {
  const {
    getInputProps,
    saveButtonProps,
    refineCore: { formLoading },
  } = useForm<PresetSchema, HttpError>({
    initialValues: {
      label: "",
      type_id: undefined,
      thumbnail_url: undefined,
    },
    validate: yupResolver(schema),
  });

  const { selectProps: typeSelectProps } = useSelect<PresetTypeSchema>({
    resource: "preset_types",
    optionLabel: "label",
  });

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <form>
        <TextInput mt="sm" label="Name" {...getInputProps("label")} />
        <Select
          mt="sm"
          label="Cateogry"
          {...getInputProps("type_id")}
          {...typeSelectProps}
        />
      </form>
    </Create>
  );
};

export default PresetCreate;
