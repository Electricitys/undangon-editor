import { cn } from "@/lib/utils";
import { UploadCloudIcon } from "lucide-react";
import React from "react";
import Dropzone, { DropzoneOptions } from "react-dropzone";
import { useToast } from "./use-toast";
import * as tus from "tus-js-client";

type FileUploadProps = {};

export const FileUpload: React.FC<FileUploadProps> = () => {
  const { toast } = useToast();
  const handleOnAccepted: DropzoneOptions["onDropAccepted"] = (files) => {
    let file = files[0];
    console.log(file);
    let upload = new tus.Upload(file, {
      // headers: {
      //   "access-control-allow-origin": "*",
      // },
      // endpoint: "https://drop.manjo.space/files",
      endpoint: `/api/drop/files`,
      // endpoint: "http://localhost:1080/files",
      // retryDelays: [0, 3000, 5000, 10000, 20000],
      onError: function (error) {
        console.log("Failed because: " + error);
      },
      onProgress: function (bytesUploaded, bytesTotal) {
        var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        console.log(bytesUploaded, bytesTotal, percentage + "%");
      },
      onSuccess: function () {
        console.log("Download %s from %s", file.name, upload.url);
      },
    });

    upload.start();

    // // Check if there are any previous uploads to continue.
    // upload.findPreviousUploads().then(function (previousUploads) {
    //   // Found previous uploads so we select the first one.
    //   if (previousUploads.length) {
    //     upload.resumeFromPreviousUpload(previousUploads[0]);
    //   }
    //   console.log(upload);

    //   // Start the upload
    //   upload.start();
    // });
  };
  const handleOnRejected: DropzoneOptions["onDropRejected"] = (files) => {
    for (let file of files) {
      toast({
        title: `File \`${file.file.name}\` was rejected`,
        description: file.errors[0].message,
      });
    }
  };
  return (
    <Dropzone
      maxSize={1024 * 1024 * 5}
      accept={{
        "image/png": [".png"],
        "image/jpeg": [".jpg", ".jpeg"],
      }}
      onDropAccepted={handleOnAccepted}
      onDropRejected={handleOnRejected}
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
            "p-3 rounded-sm border-2 border-dashed bg-slate-100",
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
            <p className="mb-4">Maximum file size 5MB.</p>
          </div>
        </div>
      )}
    </Dropzone>
  );
};
