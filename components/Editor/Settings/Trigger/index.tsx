import _pick from "lodash/pick";
import _set from "lodash/set";
import _get from "lodash/get";
import { useNode } from "@craftjs/core";
import { InteractionProps } from "./InteractionItem";
import { Interactions } from "./Interactions";

export interface TriggerProps {
  interactions: InteractionProps[];
}

const defaultValue: Partial<TriggerProps> = {
  interactions: undefined,
};

export const Trigger = () => {
  const {
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _pick(node.data.props, ["trigger"]),
  }));
  const trigger: TriggerProps = values.trigger;

  return (
    <div className="px-1">
      <div className="flex items-center pl-3 pr-1">
        <div className="grow text-sm w-full">Color</div>
        <Interactions />
      </div>
    </div>
  );
};

Trigger.defaultValue = defaultValue as TriggerProps;
