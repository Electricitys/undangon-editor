import { PanelSection } from "../../Viewport/PanelSection";
import { Spacing } from "../../Settings/Spacing";
import { ClassList } from "../../Settings/ClassList";
import { Typography } from "../../Settings/Typogrphy";
import { Input } from "@/components/ui/input";
import { useNode } from "@craftjs/core";
import _pick from "lodash/pick";
import _set from "lodash/set";
import { ExpressionInput } from "@/components/ui/expression-input";
import { useViewportFrame } from "../../Viewport/Frames/Frame";
import { useParentTemplate } from "../Template";

export const TextSettings = () => {
  const {
    id,
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _pick(node.data.props, ["text"]),
  }));

  const { frame } = useViewportFrame();

  const frameProperties = frame?.properties || [];

  return (
    <>
      <PanelSection text="Properties">
        <div className="px-2 relative">
          {/* <Input
            value={values.text}
            onChange={(e) => {
              setProp(
                (props: any) => _set(props, "text", e.target.value),
                2000
              );
            }}
          /> */}
          <ExpressionInput
            id={`${id}-text-field`}
            placeholder="value"
            defaultValue={values.text}
            onChange={(value) => {
              setProp((props: any) => _set(props, "text", value), 2000);
            }}
            variables={[...frameProperties].map((v) => ({
              key: v.id,
              value: `$${v.name}`,
            }))}
          />
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
    </>
  );
};
