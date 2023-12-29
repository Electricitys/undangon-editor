"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNode } from "@craftjs/core";
import { Cross1Icon } from "@radix-ui/react-icons";
import _pick from "lodash/pick";
import _set from "lodash/set";
import _get from "lodash/get";
import React from "react";
import { useForm } from "react-hook-form";

export interface GenericProps {
  id: string;
}

const defaultValue: Partial<GenericProps> = {
  id: undefined,
};

export const Generic = () => {
  const {
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _pick(node.data.props, ["generic"]),
  }));

  const form = useForm({
    defaultValues: {
      className: "",
    },
  });

  const generic = values.generic as GenericProps;

  const _setProps = React.useCallback(
    (path: string, value: any) => {
      setProp((props: any) => _set(props, `generic.${path}`, value), 1000);
    },
    [setProp]
  );

  return (
    <div className="px-1">
      <div className="flex items-center pl-3 pr-1">
        <div className="grow text-sm w-full">ID</div>
        <Input
          value={_get(generic, "id")}
          onChange={(e) => _setProps("id", e.target.value)}
        />
      </div>
    </div>
  );
};

Generic.defaultValue = defaultValue as GenericProps;
