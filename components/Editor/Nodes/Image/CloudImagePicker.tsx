"use client";

import { axiosInstance } from "@/components/client/feathers";
import { Button } from "@/components/ui/button";
import { ImagePicker } from "@/components/ui/image_picker";
import { generateId } from "@/components/utils/generateId";
import { imagekit } from "@/components/utils/imagekit";
import { usePagination } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import {
  ImageKitOptions,
  ListFileResponse,
} from "imagekit/dist/libs/interfaces";
import { Loader2Icon } from "lucide-react";
import React from "react";

export const CloudImagePicker: React.FC<{
  value: string;
  onChange: (value: string) => void;
  folders?: { name: string; folder: string }[];
}> = ({
  value,
  onChange,
  folders = [{ name: "Testing", folder: "testing" }],
}) => {
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
      console.log(res);
      return (
        res.reduce((_p, c, idx) => {
          return [
            ...(c.data as ListFileResponse[]).map((file) => ({
              id: file.fileId,
              url: file.url,
              preview: file.thumbnail,
              group: folders[idx],
            })),
          ] as any;
        }, []) || []
      );
    },
  });

  const pagination = usePagination({
    total: imagesQuery.data?.length || 0,
    onChange(page) {
      setFilter((f) => {
        return { ...f, skip: (page - 1) * f.limit, page };
      });
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
        console.log(file);
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
  if (imagesQuery.isInitialLoading) return "Please wait...";
  return (
    <ImagePicker
      loading={imagesQuery.isFetching || imagesQuery.isLoading}
      className="w-full rounded-s-none border-none px-3"
      images={imagesQuery.data || []}
      value={value}
      onPick={onChange}
      onFileSave={onFileSave}
    ></ImagePicker>
  );
};
