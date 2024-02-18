import { PanelSection } from "../../Viewport/PanelSection";
import { Spacing } from "../../Settings/Spacing";
import { ClassList } from "../../Settings/ClassList";
import { Typography } from "../../Settings/Typography";
import { useNode } from "@craftjs/core";
import _pick from "lodash/pick";
import _set from "lodash/set";
import { ExpressionInput } from "@/components/ui/expression-input";
import { useViewportFrame } from "../../Viewport/Frames/Frame";
import { Generic } from "../../Settings/Generic";
import { TextType } from ".";
import { Textarea } from "@mantine/core";
import { Button } from "@/components/ui/button";
import { VariableIcon } from "lucide-react";
import { useState } from "react";
import { TextIcon } from "@radix-ui/react-icons";

export const TextSettings = () => {
  const {
    id,
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _pick(node.data.props, ["text"]),
  }));

  const { frame } = useViewportFrame();

  const text: TextType = values.text;

  const frameProperties = frame?.properties || [];

  const type = useState(text.type);

  return (
    <>
      <PanelSection text="Properties">
        <div className="grid grid-cols-12 pb-2 px-2">
          <div className="px-1 col-span-10">
            {type[0] !== "expression" && (
              <Textarea
                autosize={true}
                defaultValue={text.value}
                placeholder={"Text"}
                onChange={(e) =>
                  setProp((props: any) => {
                    _set(props, "text.type", "text");
                    _set(props, "text.value", e.target.value);
                  }, 2000)
                }
              />
            )}
            {type[0] === "expression" && (
              <ExpressionInput
                id={`${id}-text-field`}
                placeholder="Expression"
                defaultValue={text.value}
                onChange={(value) => {
                  setProp((props: any) => {
                    _set(props, "text.type", "expression");
                    _set(props, "text.value", value);
                  }, 2000);
                }}
                variables={[...frameProperties].map((v) => ({
                  key: v.id,
                  value: `$${v.name}`,
                  type: v.type,
                }))}
              />
            )}
          </div>
          <div className="px-1 col-span-2">
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => {
                type[1]((value) => {
                  return value === "expression" ? "text" : "expression";
                });
              }}
            >
              {type[0] === "expression" ? (
                <VariableIcon size={18} />
              ) : (
                <TextIcon />
              )}
            </Button>
          </div>
        </div>
      </PanelSection>
      <PanelSection text="Typography">
        <Typography />
      </PanelSection>
      <PanelSection text="Spacing">
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
