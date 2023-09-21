import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import Dropzone, { DropzoneProps, useDropzone } from "react-dropzone";
import { Cross1Icon, ImageIcon, UploadIcon } from "@radix-ui/react-icons";

export const ImagePicker: React.FC<{
  value: string;
  onChange: (value: string) => void;
  className?: string;
}> = ({ value, onChange, className }) => {
  const images: string[] = [
    "url(https://images.unsplash.com/photo-1691200099282-16fd34790ade?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=90)",
    "url(https://images.unsplash.com/photo-1691226099773-b13a89a1d167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=90",
    "url(https://images.unsplash.com/photo-1688822863426-8c5f9b257090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=90)",
    "url(https://images.unsplash.com/photo-1691225850735-6e4e51834cad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=90)",
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "h-auto w-[220px] justify-start text-left font-normal",
            className
          )}
        >
          <div className="w-full items-center gap-2">
            {value && (
              <div
                className="h-24 w-auto rounded !bg-center !bg-cover transition-all"
                style={{ background: value }}
              ></div>
            )}
            <div className="truncate flex-1">
              {value ? value : "Pick a color"}
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid grid-cols-2 gap-1 mb-2">
          {images.map((s) => (
            <div
              key={s}
              style={{ backgroundImage: s }}
              className="rounded-md bg-cover bg-center h-12 w-full cursor-pointer active:scale-105"
              onClick={() => onChange(s)}
            />
          ))}
        </div>
        <div>
          <Droparea />
        </div>
      </PopoverContent>
    </Popover>
  );
};

const Droparea = (props: Partial<DropzoneProps>) => {
  const { onDrop } = props;
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    onDropRejected: (files: any) => console.log("rejected", files),
    maxSize: 10 * 1024 ** 2,
    accept: {
      ["image/jpeg"]: [".png", "jpg"],
    },
  });
  return (
    <div
      className={`dropzone min-h-12 items-center border-slate-300 border-4 rounded-lg p-3 
      ${isDragAccept ? "border-solid" : " border-dashed"}
      ${isDragAccept ? "border-blue-400" : ""}
      ${isDragReject ? "border-red-400" : ""}`}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        {isDragAccept && <UploadIcon className="h-12 w-12 inline-block" />}
        {isDragReject && <Cross1Icon className="h-12 w-12 inline-block" />}
        {!isDragActive && <ImageIcon className="h-12 w-12 inline-block" />}
      </div>

      <div>
        <div className="text-lg">Drag image here or click to select files</div>
        <div className="text-sm mt-3 text-gray-700">
          Attach as many files as you like, each file should not exceed 10mb
        </div>
      </div>
    </div>
  );
};
