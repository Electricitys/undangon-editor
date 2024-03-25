import { FileSchema, drop_client } from "@/components/client/drop_client";
import { cn } from "@/lib/utils";
import { IconFile } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2Icon, Loader2Icon, UploadCloudIcon } from "lucide-react";
import React from "react";
import { useList } from "react-use";
import { DialogFooter, DialogHeader } from "../dialog";
import { humanFileSize } from "@/components/utils/humanFilesize";
import { Button } from "../button";
import { Accept } from "react-dropzone";

type FileBrowserProps = {
  accept?: Accept;
  limit?: number;
  onSubmit: (files: FileSchema[]) => void;
};

export const FileBrowser: React.FC<FileBrowserProps> = ({
  accept,
  limit,
  onSubmit,
}) => {
  const { data, isLoading, isFetching } = useQuery(
    ["file-browser"],
    async () => {
      const data = await drop_client.find();
      console.log(data);
      return data.data;
    }
  );

  const [selected, handleSelected] = useList<string>([]);

  const handleToggle = (id: string, index: number) => {
    if (index > -1) return handleSelected.removeAt(index);
    if (limit && selected.length >= limit) return;
    handleSelected.push(id);
  };

  const handleSubmit = () => {
    if (!data) return;
    onSubmit(
      selected.map((id) => {
        const file = data.find((file) => file.id === id) as any;
        return file;
      })
    );
  };

  return (
    <>
      <div className="relative" style={{ minHeight: 250 }}>
        {(isLoading || isFetching) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 bg-opacity-50">
            <Loader2Icon size={24} className="animate-spin" />
            <div>Fetching</div>
          </div>
        )}
        <div className="grid grid-cols-2 mb-2 px-2 gap-2 relative">
          {data &&
            data.map((file) => {
              const selectIndex = selected.indexOf(file.id);
              return (
                <div
                  key={file.id}
                  className={cn(
                    "flex items-center border rounded-md p-2 cursor-pointer",
                    selectIndex > -1 ? "border-blue-500" : ""
                  )}
                  onClick={() => {
                    handleToggle(file.id, selectIndex);
                  }}
                >
                  <div className="mr-2">
                    {selectIndex > -1 ? (
                      <CheckCircle2Icon />
                    ) : (
                      <IconFile size={24} />
                    )}
                  </div>
                  <div className="flex-grow" style={{ width: 1 }}>
                    <div
                      className="text-sm font-medium truncate block"
                      title={file.name}
                    >
                      {file.name}
                    </div>
                    <div className="text-sm text-gray-500" title={file.name}>
                      {`${humanFileSize(file.size)} • ${file.type}`}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <DialogFooter className="p-4 pt-0">
        <Button onClick={() => handleSubmit()}>
          Submit {selected.length} file
        </Button>
      </DialogFooter>
    </>
  );
};
