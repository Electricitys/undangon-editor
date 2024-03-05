import { PanelSection } from "../../Viewport/PanelSection";
import { useNode } from "@craftjs/core";
import _pick from "lodash/pick";
import _set from "lodash/set";
import _get from "lodash/get";
import { AutoLayout } from "../../Settings/AutoLayout";
import { BoxSizing } from "../../Settings/BoxSizing";
import { ClassList } from "../../Settings/ClassList";
import { Fill } from "../../Settings/Fill";
import { Generic } from "../../Settings/Generic";
import { Spacing } from "../../Settings/Spacing";
import { Stroke } from "../../Settings/Stroke";
import { Typography } from "../../Settings/Typography";

export const GuestBookSettings = () => {
  const {
    id,
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _pick(node.data.props, ["token"]),
  }));

  return (
    <>
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
