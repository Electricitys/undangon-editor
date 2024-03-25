import React from "react";
import { FileDropzone, FileDropzoneProps } from "./FileDropzone";
import { FilePickerProps } from "./file_picker";
import { useList } from "react-use";
import { IconFile } from "@tabler/icons-react";
import { generateId } from "@/components/utils/generateId";
import { humanFileSize } from "@/components/utils/humanFilesize";
import { CheckIcon, Loader2Icon, XIcon } from "lucide-react";
import { Button } from "../button";
import { Progress } from "../progress";
import * as tus from "tus-js-client";
import { DialogFooter } from "../dialog";
import _pick from "lodash/pick";

type FileProps = {
  id: string;
  file: File;
  type: string;
  name: string;
  state: "idle" | "uploading" | "complete" | "error";
  url: string | null;
  progress: {
    total: number;
    offset: number;
  };
};

type FileUploadProps = FileDropzoneProps & {
  onSubmit: (files: FileProps[]) => void;
};

export const FileUpload: React.FC<FileUploadProps> = ({
  onSubmit,
  ...props
}) => {
  const { limit } = props;
  const [files, handleFiles] = useList<FileProps>([]);

  const inputState = React.useMemo(() => {
    let result = "IDLE";
    if (files.length === 0) return result;
    if (files.filter((file) => file.state !== "complete").length > 0) {
      result = "UPLOAD";
    }
    if (
      files.length > 0 &&
      files.filter((file) => file.state === "complete").length === files.length
    ) {
      result = "COMPLETE";
    }

    return result;
  }, [files]);

  const handleUpload = async () => {
    const promises = files.map(async (file) => {
      let upload = new tus.Upload(file.file, {
        metadata: {
          filetype: file.type,
          filename: file.name,
        },
        removeFingerprintOnSuccess: true,
        storeFingerprintForResuming: false,
        endpoint: `/api/drop/cdn/files`,
        onError: function (error) {
          console.log("Failed because: " + error);
          handleFiles.updateFirst((value) => value.id === file.id, {
            ...file,
            state: "error",
          });
        },
        onProgress: function (bytesUploaded, bytesTotal) {
          handleFiles.updateFirst((value) => value.id === file.id, {
            ...file,
            state: "uploading",
            progress: {
              total: bytesTotal,
              offset: bytesUploaded,
            },
          });
        },
        onSuccess: function () {
          console.log("Download %s from %s", file.name, upload.url);
          handleFiles.updateFirst((value) => value.id === file.id, {
            ...file,
            url: upload.url,
            state: "complete",
            progress: {
              total: file.file.size,
              offset: file.file.size,
            },
          });
        },
      });
      await upload.start();
    });

    await Promise.all(promises);
  };

  const handleSubmit = () => {
    onSubmit(files);
  };

  return (
    <>
      <div className="px-3">
        {files.length === 0 && (
          <FileDropzone
            {...props}
            onAccepted={(files) => {
              handleFiles.set(
                files.map((file) => ({
                  id: generateId(),
                  file: file,
                  type: file.type,
                  name: file.name,
                  state: "idle",
                  url: null,
                  progress: {
                    offset: 0,
                    total: file.size,
                  },
                }))
              );
            }}
          />
        )}
      </div>
      <div className="px-3">
        {files.map((file, id) => {
          return (
            <div key={file.id} className="mb-2">
              <div className="flex items-center">
                <div className="mr-2">
                  <IconFile size={40} />
                </div>
                <div className="flex-grow mr-1" style={{ width: 1 }}>
                  <div className="font-medium truncate" title={file.name}>
                    {file.name}
                  </div>
                  <div className="flex items-center text-slate-500">
                    {file.progress.total > 0 ? (
                      <div>
                        {file.state === "uploading" &&
                          `${humanFileSize(file.progress.offset)} of `}
                        {humanFileSize(file.progress.total)}
                      </div>
                    ) : (
                      <a
                        className="truncate block"
                        href={file.url ? file.url : undefined}
                      >
                        {file.url}
                      </a>
                    )}
                    {file.state !== "idle" && <div className="mx-2">•</div>}
                    <div className="flex items-center">
                      {file.state === "complete" && (
                        <>
                          <CheckIcon size={20} className="text-green-500" />
                          <div className="ml-1">Complete</div>
                        </>
                      )}
                      {file.state === "uploading" && (
                        <>
                          <Loader2Icon className="animate-spin" />
                          <div className="ml-1">Uploading</div>
                        </>
                      )}
                      {file.state === "error" && (
                        <>
                          <XIcon size={20} className="text-red-500" />
                          <div className="ml-1">Error</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <Button
                    size={"icon"}
                    variant="ghost"
                    onClick={() => {
                      handleFiles.removeAt(id);
                    }}
                  >
                    <XIcon />
                  </Button>
                </div>
              </div>
              {file.state === "uploading" && (
                <Progress
                  className="mt-2"
                  value={(file.progress.offset / file.progress.total) * 100}
                />
              )}
            </div>
          );
        })}
      </div>

      <DialogFooter className="p-4 pt-0">
        {inputState === "UPLOAD" && (
          <Button onClick={() => handleUpload()}>
            Upload {files.length} file
          </Button>
        )}
        {inputState === "COMPLETE" && (
          <Button onClick={() => handleSubmit()}>Done</Button>
        )}
      </DialogFooter>
    </>
  );
};
