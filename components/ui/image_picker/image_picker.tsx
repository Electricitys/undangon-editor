import { Modal, Stepper } from "@mantine/core";
import React from "react";
import { UploadFile } from "./UploadFile";
import {
  ImagePickerContext,
  ImagePickerContextProps,
  ImagePickerProvider,
} from "./ImagePickerProvider";
import { ImageAdjustment } from "./ImageAdjustment";
import { ImagePreview } from "./ImagePreview";

export const ImagePicker: React.FC<ImagePickerContextProps> = (props) => {
  const { opened, onClose } = props;
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      title="Image Picker Flow"
      withinPortal
    >
      <ImagePickerProvider {...props}>
        <ImagePickerContext.Consumer>
          {({ step }) => (
            <Stepper active={step}>
              <Stepper.Step label="Upload File">
                <UploadFile />
              </Stepper.Step>
              <Stepper.Step label="Adjust Image">
                <ImageAdjustment />
              </Stepper.Step>
              <Stepper.Step label="Preview">
                <ImagePreview />
              </Stepper.Step>
            </Stepper>
          )}
        </ImagePickerContext.Consumer>
      </ImagePickerProvider>
    </Modal>
  );
};
