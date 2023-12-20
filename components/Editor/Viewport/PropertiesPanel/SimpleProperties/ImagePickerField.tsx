import { ImagePicker } from "@/components/ui/image_picker";
import React from "react";

export type ImagePickerFieldProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
};

export const ImagePickerField: React.FC<ImagePickerFieldProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="border rounded-md max-w-full">
      <ImagePicker
        className="border-none px-3"
        value={value}
        onPick={(value) => onChange(value)}
        loading={false}
      />
    </div>
  );
};
