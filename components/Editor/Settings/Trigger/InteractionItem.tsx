import React from "react";

export type InteractionProps = {
  id: string;
  when: "tap" | "hover";
  target: string;
};

export const InteractionItem: React.FC<Pick<InteractionProps, "id">> = ({
  id,
}) => {
  return <div>id</div>;
};
