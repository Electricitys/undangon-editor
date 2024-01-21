import { PanelSection } from "../../Viewport/PanelSection";
import { Spacing } from "../../Settings/Spacing";
import { ClassList } from "../../Settings/ClassList";
import { useNode } from "@craftjs/core";
import _pick from "lodash/pick";
import _set from "lodash/set";
import _get from "lodash/get";
import { Generic } from "../../Settings/Generic";
import { Switch } from "@mantine/core";
import React from "react";
import { BoxSizing } from "../../Settings/BoxSizing";
import { DialogProps } from ".";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const DialogSettings = () => {
  const {
    id,
    actions: { setProp },
    values,
    customValues,
  } = useNode((node) => ({
    values: _pick(node.data.props, ["dialog", "dialogTriggerButton"]),
    customValues: node.data.custom,
  }));

  const dialog = values.dialog as DialogProps["dialog"];
  const dialogTriggerButton =
    values.dialogTriggerButton as DialogProps["dialogTriggerButton"];

  const _setProps = React.useCallback(
    (path: string, value: any) => {
      setProp((props: any) => _set(props, path, value), 1000);
    },
    [setProp]
  );
  const _setCustom = React.useCallback(
    (path: string, value: any) => {
      setProp((props: any) => _set(props, path, value), 1000);
    },
    [setProp]
  );

  return (
    <>
      <PanelSection text="General Setting">
        <div className="px-3">
          <Label>Dialog Identifier</Label>
          <Input
            className="mb-2"
            defaultValue={_get(customValues, "id")}
            placeholder={"Dialog Identifier"}
            onChange={(e) => _setCustom("asChild", e.target.value)}
          />
          <Switch
            className="mb-2"
            label="Preview"
            checked={dialog.stayOpen}
            onChange={(e) => {
              _setProps("dialog.stayOpen", e.target.checked);
            }}
          />
          <Switch
            className="mb-2"
            label="Default Open"
            checked={dialog.defaultValue}
            onChange={(e) => {
              console.log(e.target.checked);
              _setProps("dialog.defaultValue", e.target.checked);
            }}
          />
        </div>
      </PanelSection>
      <PanelSection text="Trigger Button">
        <div className="px-3">
          <Label>Button Text</Label>
          <Input
            className="mb-2"
            defaultValue={_get(dialogTriggerButton, "text")}
            placeholder={"Dialog Identifier"}
            onChange={(e) =>
              _setProps("dialogTriggerButton.text", e.target.value)
            }
          />
          <Switch
            className="mb-2"
            label="Hide"
            checked={_get(dialogTriggerButton, "hide")}
            onChange={(e) => {
              _setProps("dialogTriggerButton.hide", e.target.checked);
            }}
          />
        </div>
      </PanelSection>
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
