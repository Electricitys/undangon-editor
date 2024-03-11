"use client";

import { UserComponent, useNode } from "@craftjs/core";
import React from "react";
import { Generic, GenericProps } from "../../Settings/Generic";
import { AudioSettings } from "./AudioSetting";
import { useViewport } from "../../Viewport/useViewport";
import { MusicIcon } from "lucide-react";

type AudioProps = {
  src: string;

  generic: GenericProps;
};

export const Audio: UserComponent<Partial<AudioProps>> = ({ src, generic }) => {
  const {
    connectors: { connect },
  } = useNode((node) => ({
    isActive: node.events.selected,
  }));
  const { isProduction } = useViewport();

  const render = <audio {...(generic as any)} src={src}></audio>;

  if (isProduction) return render;

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
  props: { src: undefined, generic: Generic.defaultValue },
  related: {
    settings: AudioSettings,
  },
};
