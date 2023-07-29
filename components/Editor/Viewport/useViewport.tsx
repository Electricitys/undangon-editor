import { generateId } from "@/components/utils/generateId";
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

const ViewportContext = createContext<any>(null);

type ViewportProviderProps = {
  children: ReactNode;
  isProduction: boolean;
  onClose?: () => void;
  onPublish?: () => void;
  constructPreviewUrl?: string;
  id?: string;
};

export const ViewportProvider: FC<ViewportProviderProps> = ({
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
  let [currentMedia, setCurrentMedia] = useState(availableMedia["mobile"]);

  const setMedia = useCallback((name: "desktop" | "mobile") => {
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
  const viewport = useContext(ViewportContext);
  return viewport;
};
