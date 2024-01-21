"use client";

import { generateId } from "@/components/utils/generateId";
import { useInternalEditorReturnType } from "@craftjs/core/lib/editor/useInternalEditor";
import { Delete } from "@craftjs/utils";
import React, { useEffect } from "react";
import { FrameProps } from "./Frames";

const ViewportContext = React.createContext<ViewportValueProps>(null as any);

export type MediaProps = {
  setMedia: (name: "desktop" | "mobile") => void;
  currentMedia: {
    name: string;
    height: number;
    width: number;
  };
  availableMedia: {
    desktop: {
      name: string;
      height: number;
      width: number;
    };
    mobile: {
      name: string;
      height: number;
      width: number;
    };
  };
};

export type ViewportProviderProps = {
  children: React.ReactNode;
  isProduction?: boolean;
  defaultMode?: "advanced" | "simple";
  onClose?: () => void;
  onPublish: (
    frame: FrameProps,
    query: Delete<useInternalEditorReturnType<any>["query"], "deserialize">,
    loadingState: {
      isLoading: boolean;
      setLoading: (value: boolean) => void;
      isSaved: boolean;
      setSaved: (value: boolean) => void;
    }
  ) => void;
  constructPreviewUrl?: () => void;
  id?: string;
};

interface ViewportValueProps
  extends Pick<ViewportProviderProps, "isProduction" | "id"> {
  containerRef: React.RefObject<HTMLDivElement>;
  mode: {
    current: ViewportProviderProps["defaultMode"];
    setMode: (mode: ViewportProviderProps["defaultMode"]) => void;
  };
  saveStatus: {
    unsave: boolean;
    setUnsave: (status: boolean) => void;
  };
  media: MediaProps;
  handler: {
    onClose: (() => void) | undefined;
    onPublish:
      | ((
          frame: FrameProps,
          query: Delete<
            useInternalEditorReturnType<any>["query"],
            "deserialize"
          >,
          statusState: {
            isLoading: boolean;
            setLoading: (value: boolean) => void;
            isSaved: boolean;
            setSaved: (value: boolean) => void;
          }
        ) => void)
      | undefined;
    constructPreviewUrl: (() => void) | undefined;
  };
}

interface IViewportProviderProp
  extends Omit<ViewportProviderProps, "onPublish"> {
  onPublish?: ViewportProviderProps["onPublish"];
}

export const ViewportProvider: React.FC<IViewportProviderProp> = ({
  isProduction = false,

  defaultMode = "advanced",

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
  let [currentMedia, setCurrentMedia] = React.useState(
    availableMedia["mobile"]
  );

  let containerRef = React.useRef<HTMLDivElement>(null);

  const [unsave, setUnsave] = React.useState(false);

  let [mode, setMode] = React.useState<"advanced" | "simple">(defaultMode);

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

  // useEffect(() => {
  //   if (isProduction) return;

  //   let listener = (ev: any) => {
  //     ev.preventDefault();
  //     return (ev.returnValue = "Are you sure you want to close?");
  //   };

  //   if (unsave) {
  //     window.addEventListener("beforeunload", listener);
  //   }
  //   return () => {
  //     window.removeEventListener("beforeunload", listener);
  //   };
  // }, [unsave, isProduction]);

  return (
    <ViewportContext.Provider
      value={{
        containerRef,

        isProduction,
        handler,
        media,
        saveStatus: {
          unsave,
          setUnsave,
        },
        mode: {
          current: mode,
          setMode: (mode) => setMode(mode as any),
        },
        id,
      }}
    >
      {children}
    </ViewportContext.Provider>
  );
};

export const useViewport = (): ViewportValueProps => {
  const viewport = React.useContext(ViewportContext);
  return viewport;
};
