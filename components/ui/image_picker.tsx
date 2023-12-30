import React, { ReactElement, ReactNode, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import Dropzone, { DropzoneProps, useDropzone } from "react-dropzone";
import {
  CheckIcon,
  Cross1Icon,
  ImageIcon,
  UploadIcon,
} from "@radix-ui/react-icons";
import { generateId } from "../utils/generateId";
import { useList } from "react-use";
import { Loader2Icon } from "lucide-react";
import _groupBy from "lodash/groupBy";
import { PanelSection } from "../Editor/Viewport/PanelSection";
import { Badge } from "./badge";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "./dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

const defaultImages = [
  "https://images.unsplash.com/photo-1691200099282-16fd34790ade?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=90",
  "https://images.unsplash.com/photo-1691226099773-b13a89a1d167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=90",
  "https://images.unsplash.com/photo-1688822863426-8c5f9b257090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=90",
  "https://images.unsplash.com/photo-1691225850735-6e4e51834cad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=90",
];

export type ImageProps = {
  id: string;
  url: string;
  filePath: string;
  preview: string;
  group: {
    name: string;
    folder: string;
  };
};

type FilesSubmittingHelper = {
  submitting: (null | number)[];
  setSubmitting: (index: number, state: null | number) => void;
  clear: () => void;
};

export const ImagePicker: React.FC<
  React.PropsWithChildren & {
    loading: boolean;
    images?: ImageProps[];
    value: string;
    onPick: (value: string) => void;
    onFileSave?: (files: File[], helper: FilesSubmittingHelper) => void;
    placeholder?: string;
    className?: string;
    maxFiles?: 1;

    fileAction?: (image: ImageProps) => React.ReactNode;
  }
> = ({
  loading,
  value,
  onPick,
  onFileSave = () => {},
  placeholder,
  className,
  images = [],
  maxFiles = 1,
  children,
  fileAction,
}) => {
  const group = _groupBy(images, (image) => image.group.name);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "h-auto w-[220px] justify-start text-left font-normal",
            className
          )}
        >
          <div className="w-full items-center gap-2">
            {value && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="h-24 w-full rounded object-cover transition-all"
                src={value}
                alt={"Image Picker Placeholder"}
              />
            )}
            <div className="truncate flex-1">
              {value ? value : placeholder ? placeholder : "Pick Image"}
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-64 px-0">
        <Droparea
          maxFiles={maxFiles}
          onSave={(files, helper) => onFileSave(files, helper)}
        >
          {images.length > 0 && (
            <div onClick={(e) => e.stopPropagation()}>
              {Object.keys(group).map((name) => (
                <PanelSection
                  key={name}
                  text={name}
                  action={
                    <Badge variant={"outline"}>{group[name].length}</Badge>
                  }
                >
                  <div className="max-h-96 overflow-auto px-3 grid grid-cols-3 gap-1 mb-2">
                    {group[name].map((s) => (
                      <div
                        key={s.id}
                        className="relative border border-slate-400 rounded-md overflow-hidden"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={s.preview}
                          className="object-cover h-full w-full cursor-pointer active:scale-105"
                          alt={name}
                          onClick={(e) => {
                            onPick(s.url);
                          }}
                        />
                        {!(s.url === value) && fileAction && (
                          <div className="absolute top-0 right-0">
                            {fileAction(s)}
                          </div>
                        )}
                        {s.url === value && (
                          <div className="absolute inset-0 bg-blue-400/50 flex justify-center items-center">
                            <CheckIcon width={25} height={25} color="white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </PanelSection>
              ))}
              {children}
            </div>
          )}
          {images.length === 0 && (
            <div className="text-center">
              <ImageIcon className="h-12 w-12 inline-block" />
            </div>
          )}
          <div className="px-3 py-2 text-xs cursor-pointer">
            Drag image here or click to select files
          </div>
          {loading && (
            <div
              className="absolute inset-0 bg-black/25 flex justify-center items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Loader2Icon
                width={74}
                height={74}
                className="animate-spin"
                color="white"
              />
            </div>
          )}
        </Droparea>
      </DialogContent>
    </Dialog>
  );
};

const Droparea = (
  props: Partial<Omit<DropzoneProps, "children">> & {
    children?: React.ReactNode;
    onSave?: (files: File[], helper: FilesSubmittingHelper) => void;
  }
) => {
  const { onDrop, onSave, maxFiles, noClick, children } = props;
  const [files, filesAction] = useList<{
    submitting: null | number;
    preview: string;
    file: File;
    id: string;
  }>([]);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    noClick: noClick || files.length > 0,
    onDrop: (acceptedFiles, fileRejections, event) => {
      filesAction.set(
        acceptedFiles.map((file) => {
          return {
            id: generateId(),
            file,
            preview: URL.createObjectURL(file),
            submitting: null,
          };
        })
      );
      if (onDrop) onDrop(acceptedFiles, fileRejections, event);
    },
    onDropRejected: (files: any) => console.log("rejected", files),
    maxSize: 10 * 1024 ** 2,
    maxFiles,
    accept: {
      ["image/webp"]: [".webp"],
      ["image/png"]: [".png"],
      ["image/jpeg"]: [".jpg", ".jpeg"],
    },
  });

  return (
    <div className={`dropzone items-center`} {...getRootProps()}>
      <input {...getInputProps()} />
      {files.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-3 mb-2">
            {files.map(({ id, file, preview, submitting }, idx) => (
              <div key={id} className="relative">
                <div className="relative rounded-md overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="w-full" src={preview} alt={"Preview Image"} />
                  {submitting !== null && (
                    <div className="absolute inset-0 flex justify-center items-center bg-black/25">
                      {submitting < 100 ? (
                        <Loader2Icon
                          width={45}
                          height={45}
                          className="animate-spin"
                          color="white"
                        />
                      ) : (
                        <CheckIcon width={45} height={45} color="white" />
                      )}
                    </div>
                  )}
                </div>
                {submitting === null && (
                  <div className="absolute -right-2 -top-2">
                    <button
                      className="h-6 bg-red-500 rounded-full px-1"
                      onClick={(e) => {
                        e.preventDefault();
                        filesAction.removeAt(idx);
                      }}
                    >
                      <Cross1Icon className="text-white" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div>
            <Button
              onClick={(e) => {
                e.preventDefault();
                onSave?.(
                  files.map(({ file }) => file),
                  {
                    submitting: files.map(({ submitting }) => submitting),
                    setSubmitting: (index, state) => {
                      filesAction.updateAt(index, {
                        ...files[index],
                        submitting: state,
                      });
                    },
                    clear() {
                      filesAction.clear();
                    },
                  }
                );
              }}
            >
              Save
            </Button>
          </div>
        </>
      ) : (
        children
      )}
      {isDragActive && (
        <div className="fixed inset-1 border-dashed border-slate-300 border-4 rounded-lg p-4">
          <div className="bg-white absolute inset-0" />
          <div className="relative">
            <div className="text-center">
              {isDragAccept && (
                <UploadIcon className="h-12 w-12 inline-block" />
              )}
              {isDragReject && (
                <Cross1Icon className="h-12 w-12 inline-block" />
              )}
              {!isDragActive && (
                <ImageIcon className="h-12 w-12 inline-block" />
              )}
            </div>
            <div className="text-sm mt-3 text-gray-700">
              File should not exceed 10mb
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
