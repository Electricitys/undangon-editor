"use client";

import { axiosInstance } from "@/components/client/feathers";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImagePicker, ImageProps } from "@/components/ui/image_picker";
import { Popover } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { generateId } from "@/components/utils/generateId";
import { imagekit } from "@/components/utils/imagekit";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { CheckIcon, MoveIcon, TrashIcon } from "@radix-ui/react-icons";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import { ListFileResponse } from "imagekit/dist/libs/interfaces";
import React from "react";

export const CloudImagePicker: React.FC<{
  value: string;
  onChange: (value: string) => void;
  folders?: { name: string; folder: string }[];
  className?: string;
}> = ({
  value,
  onChange,
  folders = [{ name: "Testing", folder: "testing" }],
  className,
}) => {
  const { toast } = useToast();
  const [filter, setFilter] = React.useState({
    skip: 0,
    limit: 10,
    page: 1,
  });
  const imagesQuery = useQuery({
    queryKey: ["images", folders, filter],
    queryFn: async () => {
      const res = await Promise.all(
        folders.map(
          async ({ folder }) => await axiosInstance.get(`/api/images/${folder}`)
        )
      );
      return (
        res.reduce((p, c, idx) => {
          return [
            ...p,
            ...(c.data as ListFileResponse[]).map((file) => ({
              id: file.fileId,
              url: file.url,
              filePath: file.filePath,
              preview: file.thumbnail,
              group: folders[idx],
            })),
          ] as any;
        }, []) || []
      );
    },
  });

  const onFileSave = async (
    files: File[],
    helper: {
      submitting: (null | number)[];
      setSubmitting: (index: number, state: null | number) => void;
      clear: () => void;
    }
  ) => {
    await Promise.all(
      files.map(async (file, idx) => {
        helper.setSubmitting(idx, 0);
        const res = await imagekit.upload({
          file: file as any,
          fileName: generateId(),
          folder: folders[0].folder,
        });
        helper.setSubmitting(idx, 100);
        return res;
      })
    );
    helper.clear();
    imagesQuery.refetch();
  };

  const onDeleteFile = async (file: ImageProps) => {
    try {
      await axiosInstance.post(`/api/delete/image/${file.id}`);
      toast({
        title: "Delete image",
        description: `Image \`${file.id}\` was deleted.`,
      });
      imagesQuery.refetch();
    } catch (err: any) {
      toast({
        title: "Error: Delete image",
        description: err.message,
      });
    }
  };

  const onMoveFile = async (file: ImageProps, to: string) => {
    try {
      await axiosInstance.post(
        `/api/move/image/?from=${file.filePath}&to=${to}`
      );
      toast({
        title: "Move image",
        description: `Image \`${file.id}\` was moved to \`${to}\`.`,
      });
      imagesQuery.refetch();
    } catch (err: any) {
      toast({
        title: "Error: Move image",
        description: err.message,
      });
    }
  };

  if (imagesQuery.isInitialLoading) return "Please wait...";

  return (
    <ImagePicker
      loading={imagesQuery.isFetching || imagesQuery.isLoading}
      className={`w-full rounded-s-none border-none px-3 ${className}`}
      images={imagesQuery.data || []}
      value={value}
      onPick={onChange}
      onFileSave={onFileSave}
      fileAction={(file) => {
        return (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-7 w-7 p-0">
                  <MoveIcon width={18} height={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {folders.map(({ name, folder }) => (
                  <DropdownMenuItem
                    key={folder}
                    disabled={name === file.group.name}
                    onClick={() => onMoveFile(file, folder)}
                  >
                    <div className="h-6 w-6 p-1">
                      {name === file.group.name && <CheckIcon />}
                    </div>
                    <span>{name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="destructive"
              onClick={() => onDeleteFile(file)}
              className="h-7 w-7 p-0"
            >
              <TrashIcon width={18} height={18} />
            </Button>
          </div>
        );
      }}
    ></ImagePicker>
  );
};
