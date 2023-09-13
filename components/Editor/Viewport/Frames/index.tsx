import { useEditor } from "@craftjs/core";
import { PanelSection } from "../PanelSection";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, HomeIcon } from "@radix-ui/react-icons";
import React from "react";
import * as ResolverNodes from "../../Nodes";
import { useViewportFrame } from "./Frame";
import { Template } from "../Templates";
import { Properties } from "../../Settings/Properties";

export type FrameProps = {
  id: string;
  name: string;
  content: string;
  templates: Template[];
  properties: Properties[];
};

export const FramesPanel = () => {
  const { selected } = useEditor((state) => {
    const [currentNodeId] = state.events.selected;
    const currentNode = state.nodes[currentNodeId];
    let selected;
    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: currentNode.data.custom.name || currentNode.data.name,
        props: currentNode.data.props,
        type: currentNode.data.custom.type,
        node: currentNode,
        isTemplateNode: currentNode.data.type === ResolverNodes.TemplateNode,
      };
    }
    return {
      selected,
      resolver: state.options.resolver,
    };
  });
  const { frames, frame, frameHelper, framePanel } = useViewportFrame();

  const _items = React.useMemo<FrameProps[]>(() => {
    return Object.keys(frames).map((id) => {
      const frame = frames[id];
      return {
        ...frame,
        id: id,
      };
    });
  }, [frames]);

  if (!frame) return null;

  return (
    <PanelSection
      text="Detail"
      // description="Input props that this component exposes"
    >
      <div className="pl-2 pr-2">
        <div className="flex items-center">
          {framePanel[0].length > 1 ? (
            <Button
              size={"icon"}
              onClick={() => {
                frameHelper.back();
              }}
              variant={"ghost"}
            >
              <ArrowLeftIcon />
            </Button>
          ) : (
            <Button size={"icon"} disabled={true} variant={"ghost"}>
              <HomeIcon />
            </Button>
          )}
          <div className="pl-2">{frame.name}</div>
        </div>
        {/* {items.length === 0 && (
          <div className="text-gray-400 text-sm mb-4">
            No frame available yet
          </div>
        )}
        <div style={{ marginTop: 0 }}>
          {items.map((frame, index: number) => {
            return (
              <div key={frame.id} className={`flex mb-2`}>
                <Button
                  variant={"ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    frameHelper.setActiveFrame(frame.name);
                  }}
                >
                  <span>{frame.name}</span>
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div> */}
      </div>
    </PanelSection>
  );
};
