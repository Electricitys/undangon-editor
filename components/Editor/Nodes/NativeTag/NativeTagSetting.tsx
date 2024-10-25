import _get from "lodash/get";
import _set from "lodash/set";
import { BoxSizing } from "../../Settings/BoxSizing";
import { Spacing } from "../../Settings/Spacing";
import { ClassList } from "../../Settings/ClassList";
import { PanelSection } from "../../Viewport/PanelSection";
import { Typography } from "../../Settings/Typography";
import { Generic } from "../../Settings/Generic";
import { Fill } from "../../Settings/Fill";
import { useNode } from "@craftjs/core";
import { Select } from "@/components/component/Select";
import { ALLOWED_HTML_TAGS } from "../../utils/constants/HTML_TAG_NAMES";
import { AutoLayout } from "../../Settings/AutoLayout";
import { Stroke } from "../../Settings/Stroke";
import { Motion } from "../../Settings/Motion";
import { DebugSetting } from "../DebugSetting";

export const NativeTagSettings = () => {
  const {
    id,
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: node.data.props,
  }));

  return (
    <>
      <DebugSetting />
      <PanelSection text="Properties">
        <div className="px-3">
          <Select
            label={"Tag Name"}
            value={_get(values, "as")}
            onChange={(e) =>
              setProp((props: any) => {
                _set(props, "as", e);
              }, 2000)
            }
            options={ALLOWED_HTML_TAGS.map((tag) => ({
              label: tag,
              value: tag,
            }))}
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

      <PanelSection text="Animation" separator={false}>
        <Motion />
      </PanelSection>
    </>
  );
};
