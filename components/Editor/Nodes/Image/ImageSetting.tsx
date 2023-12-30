"use client";

import _pick from "lodash/pick";
import _set from "lodash/set";
import _get from "lodash/get";
import { BoxSizing } from "../../Settings/BoxSizing";
import { Spacing } from "../../Settings/Spacing";
import { ClassList } from "../../Settings/ClassList";
import { PanelSection } from "../../Viewport/PanelSection";
import { useNode } from "@craftjs/core";
import React from "react";
import { AttributesProps, Sources } from ".";
import { CloudImagePicker } from "./CloudImagePicker";
import { useClient } from "@/components/client";
import { useParams } from "next/navigation";
import { VariablePicker } from "./VariablePicker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useViewportFrame } from "../../Viewport/Frames/Frame";
import { Generic } from "../../Settings/Generic";
import { Toggle } from "@/components/ui/toggle";
import {
  BorderAllIcon,
  BoxModelIcon,
  ContainerIcon,
  ViewNoneIcon,
} from "@radix-ui/react-icons";

export const ImageSettings = () => {
  const {
    id,
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _pick(node.data.props, ["image", "attributes"]),
  }));

  const _setProps = React.useCallback(
    (path: string, raw: Sources) => {
      setProp((props: any) => _set(props, path, raw), 1000);
    },
    [setProp]
  );

  const client = useClient();
  const params = useParams();

  const attributes: AttributesProps = values.attributes;

  const { frame } = useViewportFrame();

  const frameProperties = frame?.properties || [];

  return (
    <>
      <PanelSection text="Attributes">
        <Tabs defaultValue={values["image"].type}>
          <div className="px-2">
            <TabsList className="!mt-0 w-full">
              <TabsTrigger value="image">Image</TabsTrigger>
              <TabsTrigger value="variable">Variable</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value={"variable"} tabIndex={-1} className="px-2">
            <VariablePicker
              value={
                values["image"].type === "variable" ? values["image"].value : ""
              }
              onChange={(v) =>
                _setProps("image", {
                  type: "variable",
                  value: v,
                })
              }
              variables={[...frameProperties].map((v) => ({
                key: v.id,
                value: `$${v.name}`,
                type: v.type,
              }))}
            />
          </TabsContent>
          <TabsContent value={"image"} tabIndex={-1}>
            <CloudImagePicker
              value={values["image"].value}
              folders={[
                {
                  name: "Template",
                  folder: `/templates/${params.id}`,
                },
                {
                  name: "User",
                  folder: `/user/${client.account?.id}`,
                },
              ]}
              onChange={(img) =>
                _setProps("image", {
                  type: "image",
                  value: img,
                })
              }
            />
          </TabsContent>
        </Tabs>
        <div className="flex items-center pl-3 pr-1">
          <div className="grow text-sm">Image Fit</div>
          <div className="flex border border-transparent hover:border-gray-200 rounded-md">
            <Toggle
              id="attributes.objectFit"
              pressed={_get(attributes, "objectFit") === "contain"}
              onPressedChange={(pressed) => {
                setProp(
                  (props: any) =>
                    _set(
                      props,
                      "attributes.objectFit",
                      pressed ? "contain" : undefined
                    ),
                  1000
                );
              }}
            >
              <ContainerIcon />
            </Toggle>
            <Toggle
              id="attributes.objectFit"
              pressed={_get(attributes, "objectFit") === "cover"}
              onPressedChange={(pressed) => {
                setProp(
                  (props: any) =>
                    _set(
                      props,
                      "attributes.objectFit",
                      pressed ? "cover" : undefined
                    ),
                  1000
                );
              }}
            >
              <ViewNoneIcon />
            </Toggle>
            <Toggle
              id="attributes.objectFit"
              aria-label="Fill"
              pressed={_get(attributes, "objectFit") === "fill"}
              onPressedChange={(pressed) => {
                setProp(
                  (props: any) =>
                    _set(
                      props,
                      "attributes.objectFit",
                      pressed ? "fill" : undefined
                    ),
                  1000
                );
              }}
            >
              <BorderAllIcon />
            </Toggle>
            <Toggle
              id="attributes.objectFit"
              aria-label="Fill"
              pressed={_get(attributes, "objectFit") === "scale-down"}
              onPressedChange={(pressed) => {
                setProp(
                  (props: any) =>
                    _set(
                      props,
                      "attributes.objectFit",
                      pressed ? "scale-down" : undefined
                    ),
                  1000
                );
              }}
            >
              <BoxModelIcon />
            </Toggle>
          </div>
        </div>
      </PanelSection>
      <PanelSection text="Box">
        <BoxSizing />
        <Spacing />
      </PanelSection>
      <PanelSection text="Class List" separator={false}>
        <ClassList />
      </PanelSection>
      <PanelSection text="Generic Properties" separator={false}>
        <Generic />
      </PanelSection>
    </>
  );
};
