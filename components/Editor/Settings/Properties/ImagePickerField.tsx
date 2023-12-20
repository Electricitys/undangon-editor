import { ImagePicker } from "@/components/ui/image_picker";
import React from "react";
import { CloudImagePicker } from "../../Nodes/Image/CloudImagePicker";
import { useParams } from "next/navigation";
import { useClient } from "@/components/client";

export type ImagePickerFieldProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
};

export const ImagePickerField: React.FC<ImagePickerFieldProps> = ({
  value,
  onChange,
}) => {
  const client = useClient();
  const params = useParams();
  return (
    <div
      className="border rounded-md"
      style={{ minWidth: "100%", width: "1px" }}
    >
      <CloudImagePicker
        className="w-full rounded-md border-none px-3"
        value={value}
        folders={[
          {
            name: "Template",
            folder: `/templates/${params.id}`,
          },
          {
            name: "User",
            folder: `/user/${client.account?.id}`,
          },
        ]}
        onChange={onChange}
      />
    </div>
  );
};
