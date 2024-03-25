import { cn } from "@/lib/utils";
import { UploadCloudIcon } from "lucide-react";
import React from "react";
import Dropzone, { Accept, DropzoneOptions } from "react-dropzone";
import { useToast } from "../use-toast";
import { useList } from "react-use";
import { generateId } from "@/components/utils/generateId";

export type FileDropzoneProps = {
  limit?: number;
  accept: Accept;
  onAccepted: (files: File[]) => void;
};

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  limit,
  accept,
  onAccepted,
}) => {
  const { toast } = useToast();

  const handleOnRejected: DropzoneOptions["onDropRejected"] = (files) => {
    for (let file of files) {
      toast({
        title: `File \`${file.file.name}\` was rejected`,
        description: file.errors[0].message,
      });
    }
  };

  const maxSize = React.useMemo(() => {
    return 1024 * 1000 * 10;
  }, []);

  return (
    <Dropzone
      maxSize={maxSize}
      accept={accept}
      onDropAccepted={onAccepted}
      onDropRejected={handleOnRejected}
      maxFiles={limit}
    >
      {({
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
      }) => (
        <div
          {...getRootProps()}
          className={cn(
            "p-3 rounded-xl border-4 border-dashed bg-slate-100",
            isDragAccept ? "border-blue-300" : "",
            isDragReject ? "border-red-300" : ""
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center text-gray-500 p-4">
            <UploadCloudIcon size={75} className="my-4" />
            <p className="font-bold">
              {isDragActive
                ? "Drop the files here ..."
                : "Drag 'n' drop some files here, or click to select files"}
            </p>
            <p className="mb-4">Maximum file size {maxSize / 1000 / 1024}MB.</p>
          </div>
        </div>
      )}
    </Dropzone>
  );
};
