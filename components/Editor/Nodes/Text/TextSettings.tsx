import { PanelSection } from "../../Viewport/PanelSection";
import { Spacing } from "../../Settings/Spacing";
import { ClassList } from "../../Settings/ClassList";
import { Typography } from "../../Settings/Typogrphy";
import { Input } from "@/components/ui/input";
import { useNode } from "@craftjs/core";
import _pick from "lodash/pick";
import _set from "lodash/set";

export const TextSettings = () => {
  const {
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _pick(node.data.props, ["text"]),
  }));

  return (
    <>
      <PanelSection text="Properties">
        <div className="px-2">
          <Input
            value={values.text}
            onChange={(e) => {
              setProp((props: any) => _set(props, "text", e.target.value));
            }}
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
