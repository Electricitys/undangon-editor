"use client";

import _omit from "lodash/omit";
import _pick from "lodash/pick";
import { UserComponent, useNode } from "@craftjs/core";
import React from "react";
import { Generic, GenericProps } from "../../Settings/Generic";
import { AudioSettings } from "./AudioSetting";
import { useViewport } from "../../Viewport/useViewport";
import { MusicIcon } from "lucide-react";
import { FileProp } from "@/components/ui/file_picker/file_picker";

export type AudioProps = {
  src: Omit<FileProp, "file">;

  autoPlay: boolean;
  controls: boolean;
  loop: boolean;
  muted: boolean;
};

type AudioComponentProps = {
  audio: Partial<AudioProps>;

  generic: GenericProps;
};

const defaultValue: Partial<AudioProps> = {
  src: undefined,
  autoPlay: false,
  controls: false,
  loop: false,
  muted: false,
};

export const Audio: UserComponent<Partial<AudioComponentProps>> = ({
  audio,
  generic,
}) => {
  const {
    connectors: { connect },
  } = useNode((node) => ({
    isActive: node.events.selected,
  }));

  const { isProduction, pseudoElement } = useViewport();

  const render = (
    <audio
      {..._pick(audio, ["autoPlay", "controls", "loop", "muted"])}
      {...(generic as any)}
      src={audio?.src?.url}
    />
  );

  if (!(pseudoElement.hide) || isProduction) return render;

  return (
    <div
      ref={(ref) => connect(ref as any)}
      className="bg-gray-300 justify-center flex p-2"
    >
      <MusicIcon className="text-gray-500" />
      {render}
    </div>
  );
};

Audio.craft = {
  name: "audio",
  custom: {
    alias: undefined,
    name: "Audio",
    type: "component",
  },
  props: { audio: defaultValue as any, generic: Generic.defaultValue },
  related: {
    settings: AudioSettings,
  },
};
