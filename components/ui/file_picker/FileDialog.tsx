import React from "react";
import { DialogFooter, DialogHeader } from "../dialog";
import { useList } from "react-use";
import { FileDropzone } from "./FileDropzone";
import { humanFileSize } from "@/components/utils/humanFilesize";
import { Progress } from "../progress";
import { generateId } from "@/components/utils/generateId";
import mime_types from "mime-types";
import { FileBrowser } from "./FileBrowser";
import { DialogClose } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import _pick from "lodash/pick";
import { CheckIcon, Loader2Icon, UploadCloudIcon, XIcon } from "lucide-react";
import { FilePickerProps, FileProp } from "./file_picker";
import { IconFile } from "@tabler/icons-react";
import { Button } from "../button";
import { FileUpload } from "./FileUpload";

type FilePickerDialogProps = FilePickerProps & {
  onClose: () => void;
};

export const FilePickerDialog: React.FC<FilePickerDialogProps> = ({
  limit,
  accept,
  onChange,
  onClose,
}) => {
  const [page, setPage] = React.useState<"upload" | "browse">("upload");
  const [files, handlerFiles] = useList<{
    id: string;
    file: File;
    type: string;
    name: string;
    state: "idle" | "uploading" | "complete" | "error";
    url: string | null;
    progress: {
      total: number;
      uploaded: number;
    };
  }>();
  // controllerFiles.map((file) => ({
  //   ...file,
  //   state: "idle",
  //   progress: {
  //     total: 0,
  //     uploaded: 0,
  //   },
  // }))

  return (
    <>
      <DialogHeader className="border-b">
        <div className="flex items-center justify-stretch">
          {["upload", "browse"].map((text: any) => (
            <button
              key={text}
              className={cn(
                "p-4 flex flex-col items-center grow font-bold border-r",
                page === text ? "bg-slate-100 text-blue-500" : ""
              )}
              onClick={() => setPage(text)}
            >
              <div style={{ textTransform: "capitalize" }}>{text}</div>
            </button>
          ))}
          <DialogClose asChild>
            <button className={"p-4 flex flex-col items-center font-bold"}>
              <div>
                <XIcon />
              </div>
            </button>
          </DialogClose>
        </div>
      </DialogHeader>
      {page === "upload" && (
        <FileUpload
          limit={limit}
          accept={accept}
          onAccepted={function (files) {}}
          onSubmit={function (): void {
            setPage("browse");
          }}
        />
      )}
      {page === "browse" && (
        <FileBrowser
          accept={accept}
          limit={limit}
          onSubmit={(files) => {
            onChange(files);
            onClose();
          }}
        />
      )}
    </>
  );
};
