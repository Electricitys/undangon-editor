import React from "react";
import { ImageProps } from "../ui/image_picker/ImagePickerProvider";
import { useDisclosure } from "@mantine/hooks";
import {
  ActionIcon,
  AspectRatio,
  DefaultProps,
  Image,
  UnstyledButton,
} from "@mantine/core";
import { ImagePicker } from "../ui/image_picker/image_picker";
import { Pencil1Icon, Pencil2Icon } from "@radix-ui/react-icons";

export const ImageInput: React.FC<
  DefaultProps & {
    aspectRatio?: number;
    previewImage?: string;
    onSubmit: (image: ImageProps) => void;
  }
> = ({ aspectRatio = 3 / 4, previewImage, onSubmit, ...rest }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [image, setImage] = React.useState(previewImage);
  return (
    <UnstyledButton onClick={open} {...rest}>
      <AspectRatio ratio={aspectRatio}>
        <div
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <Image
            height={"100%"}
            withPlaceholder={true}
            src={previewImage || image}
            fit="cover"
            radius="md"
            sx={{
              height: "100%",
              width: "100%",
              "& figure, & figure > div": {
                height: "100%",
                width: "100%",
              },
            }}
          />

          <div style={{ position: "absolute", bottom: 8, right: 8 }}>
            <ActionIcon component="div" variant="filled" color="primary">
              <Pencil1Icon />
            </ActionIcon>
          </div>
        </div>
      </AspectRatio>
      <ImagePicker
        aspectRatio={aspectRatio}
        opened={opened}
        onClose={() => {
          close();
        }}
        onSubmit={async (image) => {
          await onSubmit(image);
          setImage(image.croppedImage);
          close();
        }}
      />
    </UnstyledButton>
  );
};
