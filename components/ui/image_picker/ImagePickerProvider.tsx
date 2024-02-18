import { useCounter } from "@mantine/hooks";
import React from "react";
import { Area, Point } from "react-easy-crop";

export type ImageProps = {
  file: File;
  base64: string;
  croppedImage?: string;
  cropOption?: {
    croppedArea: Area;
    croppedAreaPixel: Area;
  };
};

export interface ImagePickerContextProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (image: ImageProps) => void;

  aspectRatio?: number;
}

export interface ImagePickerContextValue extends ImagePickerContextProps {
  step: number;
  nextStep: () => void;
  backStep: () => void;

  image: ImageProps | null;
  setImage: (image?: ImageProps) => void;
}

export const ImagePickerContext = React.createContext<ImagePickerContextValue>({
  step: 0,
} as ImagePickerContextValue);

export const ImagePickerProvider: React.FC<
  ImagePickerContextProps & React.PropsWithChildren
> = ({ children, ...props }) => {
  const [currentStep, handlers] = useCounter(0);

  const [image, setImage] = React.useState<
    ImagePickerContextValue["image"] | null
  >(null);

  return (
    <ImagePickerContext.Provider
      value={{
        step: currentStep,
        nextStep: handlers.increment,
        backStep: handlers.decrement,

        image,
        setImage: (image) => image && setImage(image),

        ...props,
      }}
    >
      {children}
    </ImagePickerContext.Provider>
  );
};

export const useImagePickerContext = () => {
  const context = React.useContext(ImagePickerContext);
  if (!context) {
    throw new Error(
      "useImagePickerContext must be used within a ImagePickerProvider"
    );
  }
  return context;
};
