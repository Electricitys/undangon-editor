import _pick from "lodash/pick";
import _get from "lodash/get";
import _set from "lodash/set";
import { BoxSizing } from "../../Settings/BoxSizing";
import { Spacing } from "../../Settings/Spacing";
import { ClassList } from "../../Settings/ClassList";
import { PanelSection } from "../../Viewport/PanelSection";
import { Typography } from "../../Settings/Typogrphy";
import { Generic } from "../../Settings/Generic";
import { Fill } from "../../Settings/Fill";
import { Input } from "@/components/ui/input";
import { useNode } from "@craftjs/core";

export const NativeTagSettings = () => {
  const {
    id,
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _pick(node.data.props, ["as"]),
  }));

  return (
    <>
      <PanelSection text="Properties">
        <div className="px-3">
          <Input
            defaultValue={_get(values, "as")}
            placeholder={"Text"}
            onChange={(e) =>
              setProp((props: any) => {
                _set(props, "as", e.target.value);
              }, 2000)
            }
          />
        </div>
      </PanelSection>
      <PanelSection text="Box">
        <BoxSizing />
        <Spacing />
      </PanelSection>
      <PanelSection text="Typography">
        <Typography />
      </PanelSection>
      <PanelSection text="Fill">
        <Fill />
      </PanelSection>
      <PanelSection text="Class List">
        <ClassList />
      </PanelSection>
      <PanelSection text="Generic Properties" separator={false}>
        <Generic />
      </PanelSection>
    </>
  );
};
