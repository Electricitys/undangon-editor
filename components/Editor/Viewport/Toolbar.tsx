import React from "react";
import { useViewport } from "@/components/Editor/Viewport/useViewport";
import { useEditor } from "@craftjs/core";
import { Button } from "@/components/ui/button";
import {
  ChevronDownIcon,
  CircleIcon,
  Cross2Icon,
  DesktopIcon,
  DotsHorizontalIcon,
  EyeOpenIcon,
  MobileIcon,
  ResetIcon,
  Share2Icon,
} from "@radix-ui/react-icons";
import { State } from "@/components/component/State";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useViewportFrame } from "./Frames/Frame";
import {
  CheckCircleIcon,
  CircleDashedIcon,
  PanelLeftIcon,
  PanelRightIcon,
  RocketIcon,
  UploadIcon,
} from "lucide-react";
import { useMediaSizing } from "../utils/useMediaSizing";

export const Toolbar = () => {
  const {
    media: { setMedia, currentMedia },
    saveStatus,
    handler,
    barState,
  } = useViewport();

  const { canUndo, canRedo, actions, query } = useEditor((state, query) => ({
    enabled: state.options.enabled,
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  const { frame } = useViewportFrame();
  const mediaSizing = useMediaSizing();

  const previewUrl = React.useMemo(() => {
    try {
      return handler.constructPreviewUrl?.();
    } catch (err) {
      return null;
    }
  }, [handler.constructPreviewUrl]);

  return (
    <div className="px-2 py-2 flex items-center flex-row">
      <div className="flex">
        <div className="mr-2">
          {mediaSizing.lg ? (
            <Button onClick={handler.onClose}>Close</Button>
          ) : (
            <Button variant={"ghost"} size="icon" onClick={handler.onClose}>
              <Cross2Icon />
            </Button>
          )}
        </div>
        <div className="flex">
          <Button
            disabled={!canUndo}
            onClick={() => actions.history.undo()}
            variant="outline"
            size="icon"
          >
            <ResetIcon />
          </Button>
          <Button
            disabled={!canRedo}
            onClick={() => actions.history.redo()}
            variant="outline"
            size="icon"
          >
            <ResetIcon className="transform -scale-x-100" />
          </Button>
        </div>
      </div>
      {/* <div ml={2}>
        <KeyCombo combo="shift+/" />
      </div> */}
      <div className="flex grow justify-center">
        {mediaSizing.md && (
          <>
            <Button
              className={`${currentMedia.name === "mobile" && "active"}`}
              onClick={() => setMedia("mobile")}
              variant="outline"
              size="icon"
            >
              <MobileIcon />
            </Button>
            <Button
              className={`${currentMedia.name === "desktop" && "active"}`}
              onClick={() => setMedia("desktop")}
              variant="outline"
              size="icon"
            >
              {currentMedia.name === "desktop"}
              <DesktopIcon />
            </Button>
          </>
        )}
      </div>
      <div className="flex">
        <div className="flex mr-2">
          <Button
            className="mr-1"
            title="Toggle Left Panel Bar"
            size={"icon"}
            variant="outline"
            onClick={() => barState.left.toggle()}
          >
            <PanelLeftIcon size={16} />
          </Button>
          <Button
            title="Toggle Right Panel Bar"
            size={"icon"}
            variant="outline"
            onClick={() => barState.right.toggle()}
          >
            <PanelRightIcon size={16} />
          </Button>
        </div>
        <State defaultValue={false}>
          {({ state: isLoading, setState: setLoading }) => (
            <>
              <Button
                variant="ghost"
                loading={isLoading}
                size={"icon"}
                className="pointer-events-none"
              >
                {saveStatus.unsave ? (
                  <CircleDashedIcon size={16} />
                ) : (
                  <CheckCircleIcon size={16} />
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="ml-1">
                    <UploadIcon size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    disabled={frame?.name !== "App"}
                    onClick={() =>
                      handler.onPublish?.(frame, query, {
                        isLoading,
                        setLoading,
                        isSaved: !saveStatus.unsave,
                        setSaved(value) {
                          saveStatus.setUnsave(!value);
                        },
                      })
                    }
                  >
                    <RocketIcon className="mr-2 h-4 w-4" />
                    <span>Publish</span>
                  </DropdownMenuItem>
                  {!!previewUrl && (
                    <DropdownMenuItem asChild>
                      <a href={previewUrl} target="_blank">
                        <EyeOpenIcon className="mr-2 h-4 w-4" />
                        <span>Preview</span>
                      </a>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <Share2Icon className="mr-2 h-4 w-4" />
                    <span>Export</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </State>
      </div>
    </div>
  );
};
