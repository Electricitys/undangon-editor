import { PanelSection } from "../../Viewport/PanelSection";
import { useNode } from "@craftjs/core";
import _pick from "lodash/pick";
import _set from "lodash/set";
import _get from "lodash/get";
import { Select } from "@/components/component/Select";
import { AutoLayout } from "../../Settings/AutoLayout";
import { BoxSizing } from "../../Settings/BoxSizing";
import { ClassList } from "../../Settings/ClassList";
import { Fill } from "../../Settings/Fill";
import { Generic } from "../../Settings/Generic";
import { Spacing } from "../../Settings/Spacing";
import { Stroke } from "../../Settings/Stroke";
import { Typography } from "../../Settings/Typography";

export const GuestBookFormInputSettings = () => {
  const {
    id,
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _pick(node.data.props, ["part"]),
  }));

  return (
    <>
      <PanelSection text="Properties">
        <div className="grid grid-cols-12 pb-2 px-2">
          <div className="px-1 col-span-10">
            <Select
              label={"Part"}
              value={_get(values, "part")}
              onChange={(e) =>
                setProp((props: any) => {
                  _set(props, "part", e);
                }, 2000)
              }
              options={["title", "message"].map((tag) => ({
                label: tag,
                value: tag,
              }))}
            />
          </div>
          <div className="px-1 col-span-2"></div>
        </div>
      </PanelSection>
      <PanelSection text="Box">
        <BoxSizing />
        <Spacing />
      </PanelSection>
      <PanelSection text="Typography">
        <Typography />
      </PanelSection>
      <PanelSection text="Auto Layout">
        <AutoLayout />
      </PanelSection>
      <PanelSection text="Fill">
        <Fill />
      </PanelSection>
      <PanelSection text="Stroke">
        <Stroke />
      </PanelSection>
      <PanelSection text="Class List">
        <ClassList />
      </PanelSection>
      <PanelSection text="Generic Properties">
        <Generic />
      </PanelSection>
    </>
  );
};
