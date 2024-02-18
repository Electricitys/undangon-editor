import { Box, Button, Group } from "@mantine/core";
import { useImagePickerContext } from "./ImagePickerProvider";

import Cropper, { Area } from "react-easy-crop";
import React from "react";

export const ImageAdjustment = () => {
  const { image, setImage, aspectRatio, nextStep } = useImagePickerContext();

  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);
  const [croppedArea, setCroppedArea] = React.useState<Area>();
  const [croppedAreaPixel, setCroppedAreaPixel] = React.useState<Area>();

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedArea);
    setCroppedAreaPixel(croppedAreaPixels);
  };

  return (
    <>
      <Box h={"350px"} w="100%" pos="relative">
        <Cropper
          image={image?.base64}
          crop={crop}
          rotation={rotation}
          zoom={zoom}
          zoomSpeed={0.1}
          aspect={aspectRatio || 1}
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </Box>
      <Group mt="lg" position="right">
        <Button
          w="25%"
          onClick={() => {
            if (!image) return;
            setImage({
              ...image,
              cropOption: {
                croppedArea: croppedArea!,
                croppedAreaPixel: croppedAreaPixel!,
              },
            });
            nextStep();
          }}
        >
          Next
        </Button>
      </Group>
    </>
  );
};
