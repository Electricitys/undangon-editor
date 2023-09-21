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
    <div className="border rounded-e-md">
      <ImagePicker className="w-full rounded-s-none border-none px-3" value={value} onChange={onChange} />
    </div>
  );
};
