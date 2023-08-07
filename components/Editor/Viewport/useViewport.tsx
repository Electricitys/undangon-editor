"use client";

import { generateId } from "@/components/utils/generateId";
import { useInternalEditorReturnType } from "@craftjs/core/lib/editor/useInternalEditor";
import { Delete } from "@craftjs/utils";
import React from "react";

const ViewportContext = React.createContext<any>(null);

export type ViewportProviderProps = {
  children: React.ReactNode;
  isProduction?: boolean;
  onClose?: () => void;
  onPublish: (
    query: Delete<useInternalEditorReturnType<any>["query"], "deserialize">,
    loadingState: { isLoading: boolean; setLoading: (value: boolean) => void }
  ) => void;
  constructPreviewUrl?: () => void;
  id?: string;
};

interface IViewportProviderProp
  extends Omit<ViewportProviderProps, "onPublish"> {
  onPublish?: ViewportProviderProps["onPublish"];
}

export const ViewportProvider: React.FC<IViewportProviderProp> = ({
  isProduction = false,

  children,
  onClose,
  onPublish,
  constructPreviewUrl,

  id = generateId(),
}) => {
  let availableMedia = {
    desktop: {
      name: "desktop",
      height: 720,
      width: 1024,
    },
    mobile: {
      name: "mobile",
      height: 667,
      width: 375,
    },
  };
  let [currentMedia, setCurrentMedia] = React.useState(availableMedia["mobile"]);

  const setMedia = React.useCallback((name: "desktop" | "mobile") => {
    setCurrentMedia(availableMedia[name]);
  }, []);

  const media = {
    setMedia,
    currentMedia,
    availableMedia,
  };

  const handler = {
    onClose,
    onPublish,
    constructPreviewUrl,
  };

  return (
    <ViewportContext.Provider
      value={{
        isProduction,
        media,
        handler,
        id,
      }}
    >
      {children}
    </ViewportContext.Provider>
  );
};

export const useViewport = () => {
  const viewport = React.useContext(ViewportContext);
  return viewport;
};
