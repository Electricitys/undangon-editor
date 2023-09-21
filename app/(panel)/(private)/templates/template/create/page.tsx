import { CategorySchema, TemplateSchema } from "@/components/interfaces";
import { Select, TextInput } from "@mantine/core";
import { yupResolver } from "@mantine/form";
import { HttpError } from "@refinedev/core";
import { Create, useForm, useSelect } from "@refinedev/mantine";
import * as Yup from "yup";

const schema = Yup.object().shape({
  name: Yup.string().min(2, "Name must have at least 3 letters"),
  category_id: Yup.number().required(),
});

const TemplateCreate: React.FC = () => {
  const {
    getInputProps,
    saveButtonProps,
    refineCore: { formLoading },
  } = useForm<TemplateSchema, HttpError>({
    initialValues: {
      name: "",
      category_id: undefined,
      thumbnail_url: undefined,
    },
    validate: yupResolver(schema),
  });

  const { selectProps: categorySelectProps } = useSelect<CategorySchema>({
    resource: "categories",
    optionLabel: "name",
  });

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <form>
        <TextInput mt="sm" label="Name" {...getInputProps("name")} />
        <Select
          mt="sm"
          label="Cateogry"
          {...getInputProps("category_id")}
          {...categorySelectProps}
        />
      </form>
    </Create>
  );
};

export default TemplateCreate;
