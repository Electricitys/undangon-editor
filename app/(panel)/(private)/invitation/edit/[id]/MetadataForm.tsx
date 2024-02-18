import React from "react";
import { MetadataSchema } from "@/components/interfaces";
import { yupResolver } from "@/components/utils/mantineYupResolver";
import { Button, Group, Text, TextInput, Title } from "@mantine/core";
import * as Yup from "yup";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useForm } from "@refinedev/mantine";
import { ImageInput } from "@/components/component/ImageInput";
import { imagekit } from "@/components/utils/imagekit";
import { blobUrlToBase64 } from "@/components/utils/blobUrlToBase64";

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
    setFieldValue,
    refineCore: { onFinish },
  } = useForm<MetadataData>({
    initialValues: {
      title: "",
      description: undefined,
      image: undefined,
      image_width: undefined,
      image_height: undefined,
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
      <div>
        <Text mt={"md"} component="label" size={"sm"} display={"block"}>
          Link Image
        </Text>
        <ImageInput
          mt={4}
          aspectRatio={1200 / 630}
          w={"50%"}
          maw={500}
          previewImage={values.image as string}
          onSubmit={async function (image) {
            console.log(image);
            const thumbnail = await imagekit.upload({
              file: (await blobUrlToBase64(image.croppedImage)) as any,
              fileName: `${id}.png`,
              folder: `thumbnails/invitations/meta_image`,
            });
            setFieldValue("image", thumbnail.url);
          }}
        />
      </div>
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
