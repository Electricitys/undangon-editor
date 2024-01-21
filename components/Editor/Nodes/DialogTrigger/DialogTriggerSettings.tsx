import { PanelSection } from "../../Viewport/PanelSection";
import { useNode } from "@craftjs/core";
import _pick from "lodash/pick";
import _set from "lodash/set";
import _get from "lodash/get";
import { Switch } from "@mantine/core";
import React from "react";
import { DialogTriggerProps } from ".";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const DialogTriggerSettings = () => {
  const {
    id,
    actions: { setProp, setCustom },
    values,
    customValues,
  } = useNode((node) => ({
    values: _pick(node.data.props, ["dialog"]),
    customValues: node.data.custom,
  }));

  const dialog = values.dialog as DialogTriggerProps["dialog"];

  const _setProps = React.useCallback(
    (path: string, value: any) => {
      setProp((props: any) => _set(props, path, value), 1000);
    },
    [setProp]
  );
  const _setCustom = React.useCallback(
    (path: string, value: any) => {
      setCustom((custom: any) => _set(custom, path, value), 1000);
    },
    [setCustom]
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
            label="As Child"
            checked={dialog.asChild}
            onChange={(e) => {
              _setProps("dialog.asChild", e.target.checked);
            }}
          />
        </div>
      </PanelSection>
    </>
  );
};
