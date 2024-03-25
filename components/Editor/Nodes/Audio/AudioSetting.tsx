import React from "react";
import _pick from "lodash/pick";
import _get from "lodash/get";
import _set from "lodash/set";
import { PanelSection } from "../../Viewport/PanelSection";
import { Generic } from "../../Settings/Generic";
import { useNode } from "@craftjs/core";
import { FilePicker } from "@/components/ui/file_picker/file_picker";
import { Switch } from "@/components/ui/switch";
import { AudioProps } from ".";

export const AudioSettings = () => {
  const {
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _pick(node.data.props, ["audio"]),
  }));

  const audio = values.audio as AudioProps;

  const _setPropsValue = React.useCallback(
    (path: string, value: any) => {
      setProp(
        (props: any) =>
          _set(props, path, value === undefined ? undefined : value),
        1000
      );
    },
    [setProp]
  );

  return (
    <>
      <PanelSection text="Properties">
        <div className="px-3 mb-2">
          <FilePicker
            limit={1}
            files={_get(audio, "src") ? [_get(audio, "src")] : undefined}
            accept={{
              "audio/mpeg": [".mpg", ".mpa", ".mpga", ".mp2", ".m2a"],
              "audio/mpeg3": [".mp3"],
              "audio/x-mpeg3": [".mp3"],
            }}
            onChange={function (files) {
              setProp((prop: any) => _set(prop, "audio.src", files[0]), 1000);
            }}
          />
        </div>
        <div className="flex items-center pl-3 pr-1">
          <div className="grow text-xs w-full">Auto Play</div>
          <div className="shrink-0 w-32">
            <Switch
              id="audio.autoPlay"
              checked={audio.autoPlay}
              onCheckedChange={function (value) {
                _setPropsValue("audio.autoPlay", value);
              }}
            />
          </div>
        </div>
        <div className="flex items-center pl-3 pr-1">
          <div className="grow text-xs w-full">Controls</div>
          <div className="shrink-0 w-32">
            <Switch
              id="audio.controls"
              checked={audio.controls}
              onCheckedChange={function (value) {
                _setPropsValue("audio.controls", value);
              }}
            />
          </div>
        </div>
        <div className="flex items-center pl-3 pr-1">
          <div className="grow text-xs w-full">Loop</div>
          <div className="shrink-0 w-32">
            <Switch
              id="audio.loop"
              checked={audio.loop}
              onCheckedChange={function (value) {
                _setPropsValue("audio.loop", value);
              }}
            />
          </div>
        </div>
        <div className="flex items-center pl-3 pr-1">
          <div className="grow text-xs w-full">Muted</div>
          <div className="shrink-0 w-32">
            <Switch
              id="audio.muted"
              checked={audio.muted}
              onCheckedChange={function (value) {
                _setPropsValue("audio.muted", value);
              }}
            />
          </div>
        </div>
      </PanelSection>
      <PanelSection text="Generic Properties">
        <Generic />
      </PanelSection>
    </>
  );
};
