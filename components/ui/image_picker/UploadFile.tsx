import { Text } from "@mantine/core";
import { Group, useMantineTheme } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import {
  IconUpload,
  IconX,
  IconFileTypeCsv,
  IconFileTypeJpg,
} from "@tabler/icons-react";
import React from "react";
import { useImagePickerContext } from "./ImagePickerProvider";

export const UploadFile = () => {
  const theme = useMantineTheme();
  const { nextStep, setImage } = useImagePickerContext();
  const handleDrop = React.useCallback(async (files: FileWithPath[]) => {
    const file = files[0];
    if (!file) return;

    setImage({
      file,
      base64: URL.createObjectURL(file),
    });
    nextStep();
  }, []);

  return (
    <Dropzone
      // loading={loading}
      onDrop={handleDrop}
      accept={["image/jpeg", "image/png"]}
      maxFiles={1}
      size="lg"
      label="Drop files here or click to select"
    >
      <Group
        position="center"
        spacing="xl"
        style={{ minHeight: 220, pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <IconUpload
            size={50}
            stroke={1.5}
            color={
              theme.colors[theme.primaryColor][
                theme.colorScheme === "dark" ? 4 : 6
              ]
            }
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            size={50}
            stroke={1.5}
            color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconFileTypeJpg size={50} stroke={1.5} />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            Drag image file here or click to select files
          </Text>
          <Text size="sm" color="dimmed" inline mt={7}>
            Attach as many files as you like, each file should not exceed 5mb
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
};
