import { Button } from "../button";
import { Dialog, DialogContent, DialogTrigger } from "../dialog";
import { IconFile } from "@tabler/icons-react";
import React from "react";
import { Accept } from "react-dropzone";
import { useDisclosure } from "@mantine/hooks";
import { FilePickerDialog } from "./FileDialog";

export type FileProp = {
  id: string;
  file: File;
  url: string | null;
  type: string;
  name: string;
};

export type FilePickerProps = {
  limit?: number;
  accept: Accept;
  files?: Omit<FileProp, "file">[];
  onChange: (files: Omit<FileProp, "file">[]) => void;
};

export const FilePicker: React.FC<FilePickerProps> = (props) => {
  const { limit, accept, files: controlledFiles = [], onChange } = props;
  const [isOpen, { toggle }] = useDisclosure(false);

  return (
    <Dialog open={isOpen} onOpenChange={() => toggle()}>
      <div>
        <DialogTrigger asChild>
          <Button>Choose File</Button>
        </DialogTrigger>
        {controlledFiles.length > 0 && (
          <div className="border rounded-lg p-3 mt-3">
            {controlledFiles.map((file) => (
              <div key={file.id} className="flex items-center">
                <div className="mr-2">
                  <IconFile size={24} />
                </div>
                <div className="flex-grow" style={{ width: 1 }}>
                  <a
                    href={file.url ? file.url : undefined}
                    target="_blank"
                    className="text-sm font-medium truncate block"
                    title={file.name}
                  >
                    {file.name}
                  </a>
                  <div className="text-sm text-gray-500" title={file.name}>
                    {file.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <DialogContent className="p-0">
        <FilePickerDialog
          onClose={function (): void {
            toggle();
          }}
          {...props}
        />
      </DialogContent>
    </Dialog>
  );
};
