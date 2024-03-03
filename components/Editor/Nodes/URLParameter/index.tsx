"use client";

import { UserComponent, useNode } from "@craftjs/core";
import React from "react";
import _get from "lodash/get";
import { useSearchParams } from "next/navigation";
import { URLParameterSettings } from "./URLParameterSettings";

type URLParameterProps = {
  fieldName: string;
};

export const URLParameter: UserComponent<Partial<URLParameterProps>> = ({
  fieldName,
}) => {
  const searchParams = useSearchParams();
  const {
    connectors: { connect },
  } = useNode((node) => ({
    isActive: node.events.selected,
  }));

  const value = React.useMemo(() => {
    return searchParams.get(fieldName!);
  }, [searchParams, fieldName]);

  return (
    <div ref={(ref) => connect(ref as any)}>
      {!!fieldName && !!value ? value : "Some value"}
    </div>
  );
};

URLParameter.craft = {
  name: "URLParameter",
  custom: {
    alias: undefined,
    name: "URL Parameter",
    type: "component",
  },
  props: {
    fieldName: undefined,
  },
  related: {
    settings: URLParameterSettings,
  },
};
