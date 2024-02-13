import React from "react";
import { InvitationSchema, MetadataSchema } from "@/components/interfaces";
import { yupResolver } from "@/components/utils/mantineYupResolver";
import { Button, Group, TextInput, Title } from "@mantine/core";
import { useOne } from "@refinedev/core";
import * as Yup from "yup";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useForm } from "@refinedev/mantine";

type MetadataData = Pick<
  MetadataSchema,
  "title" | "description" | "image" | "image_width" | "image_height"
>;

const Schema = Yup.object().shape({
  title: Yup.string(),
  description: Yup.string().optional(),
  image: Yup.string().optional(),
  image_width: Yup.string().optional(),
  image_height: Yup.string().optional(),
});

export const MetadataForm: React.FC<{
  id: string | number;
}> = ({ id }) => {
  const {
    getInputProps,
    isDirty,
    values,
    refineCore: { onFinish },
  } = useForm<MetadataData>({
    initialValues: {
      title: "",
    },
    validate: yupResolver(Schema),
    refineCoreProps: {
      action: "edit",
      resource: "metadata",
      id,
      redirect: false,
    },
  });

  const handleSubmit = async () => {
    await onFinish(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Title order={3}>Metadata</Title>
      <TextInput mt="sm" label="Title" {...getInputProps("title")} />
      <TextInput
        mt="sm"
        label="Description"
        {...getInputProps("description")}
      />
      <Group position="right">
        <Button
          disabled={!isDirty()}
          mt="md"
          type="submit"
          leftIcon={<IconDeviceFloppy size={18} />}
        >
          Save
        </Button>
      </Group>
    </form>
  );
};
