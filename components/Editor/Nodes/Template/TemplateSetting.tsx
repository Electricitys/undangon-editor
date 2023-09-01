import { useNode } from "@craftjs/core";
import _pick from "lodash/pick";
import _set from "lodash/set";
import { PanelSection } from "../../Viewport/PanelSection";
import { Properties, PropsProps } from "../../Settings/Properties";
import React from "react";

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
