import { Select } from "@/components/component/Select";
import { CSSUnitInput, uncss } from "@/components/ui/css_unit_input";
import { useNode } from "@craftjs/core";
import _pick from "lodash/pick";
import _set from "lodash/set";
import { BoxSizing, BoxSizingProps } from "../../Settings/BoxSizing";
import { Spacing } from "../../Settings/Spacing";
import { ClassList } from "../../Settings/ClassList";
import { PanelSection } from "../../Viewport/PanelSection";
import { Typography } from "../../Settings/Typogrphy";
import { Properties, PropsProps } from "../../Settings/Properties";
import { Button } from "@/components/ui/button";
import React from "react";
import { generateId } from "@/components/utils/generateId";
import { PlusIcon } from "@radix-ui/react-icons";

export const TemplateSettings = () => {
  const {
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _pick(node.data.props, ["props"]),
  }));

  return (
    <PanelSection
      text="Props"
      description="Input props that this component exposes"
    >
      <Properties
        disableTrash={true}
        addButton={false}
        value={values.props}
        onChange={(p) => {
          setProp((props: { props: PropsProps[] }) => {
            _set(props, "props", p);
          }, 1000);
        }}
      />
    </PanelSection>
  );
};
