import { Box, Button, Group, Image } from "@mantine/core";
import React, { useEffect, useState } from "react";
import getCroppedImg from "./cropImage";
import { useImagePickerContext } from "./ImagePickerProvider";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";

export const ImagePreview = () => {
  const { image, onSubmit } = useImagePickerContext();
  const [previewImage, setPreviewImage] = useState<string | null>();
  const [isLoading, { open: loading, close: complete }] = useDisclosure(false);

  useEffect(() => {
    const process = async () => {
      if (!image || !image.cropOption) return;
      setPreviewImage(
        await getCroppedImg(image.base64, image.cropOption.croppedAreaPixel)
      );
    };
    process();
  }, []);

  return (
    <Box>
      <Box maw="50%" mx="auto">
        <Image alt="Preview Image" withPlaceholder src={previewImage} />
      </Box>
      <Group mt="lg" position="center">
        <Button
          loading={isLoading}
          disabled={!image}
          onClick={async () => {
            loading();
            try {
              await onSubmit({
                ...image!,
                croppedImage: previewImage!,
              });
            } catch (err) {
              complete();
              showNotification({
                title: (err as Error).name,
                message: (err as Error).message,
              });
            }
          }}
        >
          Submit
        </Button>
      </Group>
    </Box>
  );
};
