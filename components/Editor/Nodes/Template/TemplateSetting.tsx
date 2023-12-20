import { useNode } from "@craftjs/core";
import _pick from "lodash/pick";
import _set from "lodash/set";
import { PanelSection } from "../../Viewport/PanelSection";
import { Properties, PropertiesInput } from "../../Settings/Properties";
import React from "react";
import { useViewportFrame } from "../../Viewport/Frames/Frame";

export const TemplateSettings = () => {
  const {
    id,
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _pick(node.data.props, ["props"]),
  }));

  const { frame } = useViewportFrame();

  const frameProperties = frame?.properties || [];

  return (
    <PanelSection
      text="Props"
      description="Input props that this component exposes"
    >
      <PropertiesInput
        disableTrash={true}
        addButton={false}
        value={values.props}
        availableVariables={[...frameProperties, ...values.props]}
        onChange={(p) => {
          setProp((props: { props: Properties[] }) => {
            _set(props, "props", p);
          }, 2000);
        }}
        onPropertyChange={() => {}}
      />
    </PanelSection>
  );
};
