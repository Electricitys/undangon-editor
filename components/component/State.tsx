import React from "react";

type StateProps = {
  children: ({
    state,
    setState,
    ref,
  }: {
    state: any;
    setState: React.Dispatch<any>;
    ref: React.Ref<any>;
  }) => React.ReactNode;
  defaultValue: any;
};

export const State: React.FC<StateProps> = ({ defaultValue, children }) => {
  const [state, setState] = React.useState(defaultValue);
  const ref = React.useRef();
  return children({ state, setState, ref });
};
