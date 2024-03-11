import React from "react";
import _get from "lodash/get";
import { useNode } from "@craftjs/core";
import { TriggerProps } from ".";
import { InteractionItem } from "./InteractionItem";

export type InteractionProps = {
  id: string;
  when: "tap" | "hover";
  target: string;
};

export const Interactions: React.FC = () => {
  const {
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _get(node.data.props, ["trigger"]),
  }));

  const trigger: TriggerProps = values.trigger;

  return (
    <div>
      {trigger.interactions.map(({ id }) => {
        return <InteractionItem key={id} id={id} />;
      })}
    </div>
  );
};
