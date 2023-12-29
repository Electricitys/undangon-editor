import { Select } from "@/components/component/Select";
import { CSSUnitInput, uncss } from "@/components/ui/css_unit_input";
import { useNode } from "@craftjs/core";
import _pick from "lodash/pick";
import _set from "lodash/set";
import { BoxSizing, BoxSizingProps } from "../../Settings/BoxSizing";
import { Spacing } from "../../Settings/Spacing";
import { ClassList } from "../../Settings/ClassList";
import { PanelSection } from "../../Viewport/PanelSection";
import { Generic } from "../../Settings/Generic";

export const ContainerSettings = () => {
  return (
    <>
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
