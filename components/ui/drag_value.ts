import React, { useCallback, useEffect, useRef, useState } from "react";

type DragValueProps = {
  min: number;
  max: number;
  friction?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  children: (props: {
    handleMouseDown: (event: any) => void;
    isDisabled: boolean;
  }) => React.ReactNode;
  disabled: boolean;
};

export const DragValue = ({
  min = -255,
  max = 255,
  friction = 1,
  step = 1,
  value,
  onChange,
  children,
  disabled,
}: DragValueProps): React.ReactNode => {
  // We are creating a snapshot of the values when the drag starts
  // because the [value] will itself change & we need the original
  // [value] to calculate during a drag.
  const [snapshot, setSnapshot] = useState(Number(value));

  // This captures the starting position of the drag and is used to
  // calculate the diff in positions of the cursor.
  const [startVal, setStartVal] = useState(0);

  // Start the drag to change operation when the mouse button is down.
  const onStart = useCallback(
    (event: any) => {
      setStartVal(event.clientX);
      setSnapshot(value);
    },
    [value]
  );

  // We use document events to update and end the drag operation
  // because the mouse may not be present over the label during
  // the operation..
  useEffect(() => {
    if (disabled) return;
    // Only change the value if the drag was actually started.
    const onUpdate = (event: any) => {
      if (startVal) {
        const increment = Math.round((event.clientX - startVal) / friction);
        const filtered = value_limit(snapshot + increment * step, min, max);
        onChange(filtered);
      }
    };

    // Stop the drag operation now.
    const onEnd = () => {
      setStartVal(0);
    };

    document.addEventListener("mousemove", onUpdate);
    document.addEventListener("mouseup", onEnd);
    return () => {
      document.removeEventListener("mousemove", onUpdate);
      document.removeEventListener("mouseup", onEnd);
    };
  }, [startVal, onChange, snapshot, disabled, min, max]);

  return children({
    handleMouseDown: onStart,
    isDisabled: disabled,
  });
};

function value_limit(val: number, min: number, max: number) {
  return val < min ? min : val > max ? max : val;
}
