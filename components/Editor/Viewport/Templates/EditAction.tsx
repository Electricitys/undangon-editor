import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NodeData, NodeId, useEditor } from "@craftjs/core";
import { useLayer } from "@craftjs/layers";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { ChevronRight } from "lucide-react";
import { useViewportFrame, useViewportFrameTemplates } from "../Frames/Frame";
import { useViewport } from "../useViewport";
import { Template } from ".";

export const EditAction = ({ template }: { template: Template }) => {
  const { frameHelper } = useViewportFrame();

  const { helper: templatesHelper } = useViewportFrameTemplates();

  const handleEditTemplate = () => {
    frameHelper.push({
      id: template.id,
      name: template.name,
      content: JSON.stringify(template.nodeTree.nodes),
      properties: template.properties,
      defaultMode: "advanced",
      handler: {
        async onBack(target, value, helper) {
          const targetFrame = helper.get(target);
          const templates = targetFrame.templates;
          // const content = targetContent[frameId];
          // const newContent = {
          //   ...targetContent,
          //   [frameId]: {
          //     ...content,
          //     props: {
          //       ...content.props,
          //       props: helper.get(frameId).properties,
          //       nodeTree: {
          //         rootNodeId: "ROOT",
          //         nodes: await JSON.parse(value),
          //       },
          //     },
          //   },
          // };

          const nodeTree = {
            rootNodeId: "ROOT",
            nodes: await JSON.parse(value),
            templates: [],
          };
          const targetTemplateId = templates.findIndex(({ id: i }) => target === i);
          let newTemplates = [...templates];
          newTemplates[targetTemplateId] = {
            ...templates[targetTemplateId],
            ...nodeTree,
          };
          window.localStorage.setItem(
            "manjo.presets",
            JSON.stringify(newTemplates)
          );
          await helper.updateFrameAt(target, {
            templates: [...newTemplates],
            _updatedAt: Date.now(),
          });
        },
      },
      templates: [],
      _updatedAt: Date.now(),
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={"sm"}
          variant={"ghost"}
          className="hover:bg-gray-200 p-0 h-7 w-7 mr-1"
        >
          <Pencil1Icon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem color="red" onClick={handleEditTemplate}>
          <span>Open Editor</span>
          <ChevronRight className="ml-2 h-4 w-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
