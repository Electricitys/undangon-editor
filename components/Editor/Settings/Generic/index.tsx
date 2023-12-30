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
import _uniq from "lodash/uniq";
import _unset from "lodash/unset";
import React from "react";
import { useForm } from "react-hook-form";

const REQUIRED_GENERIC_PROPS = ["id"];

export interface GenericProps {
  id: string | null | undefined;
  [key: string]: string | null | undefined;
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
      prop_name: "",
    },
  });

  const generic = values.generic as GenericProps;

  const prop_names = React.useMemo(() => {
    return _uniq([...REQUIRED_GENERIC_PROPS, ...Object.keys(generic || {})]);
  }, [generic]);

  const _setProps = React.useCallback(
    (path: string, value: any) => {
      setProp((props: any) => _set(props, `generic.${path}`, value), 1000);
    },
    [setProp]
  );

  const deleteProp = React.useCallback(
    (path: string) => {
      setProp((props: any) => _unset(props, `generic.${path}`), 1000);
    },
    [setProp]
  );

  const handleAddProperties = (values: { prop_name: string }) => {
    _setProps(values.prop_name, "");
    form.reset();
  };

  return (
    <div className="px-1">
      {prop_names.map((prop_name) => (
        <div key={prop_name} className="flex items-center pl-3 pr-1 pb-2">
          <div className="grow text-sm w-full">{prop_name}</div>
          <Input
            value={_get(generic, prop_name) || ""}
            onChange={(e) => _setProps(prop_name, e.target.value)}
          />
          <Button
            disabled={REQUIRED_GENERIC_PROPS.indexOf(prop_name) > -1}
            variant={"ghost"}
            size={"icon"}
            className="px-2"
            onClick={() => {
              deleteProp(prop_name);
            }}
          >
            <Cross1Icon height={16} width={16} />
          </Button>
        </div>
      ))}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAddProperties)}>
          <FormField
            control={form.control}
            name="prop_name"
            render={({ field }) => (
              <FormControl>
                <div className="flex">
                  <Input
                    id="prop_name"
                    placeholder="Type here"
                    className="mr-2"
                    {...field}
                  />
                  <Button type="submit">Add</Button>
                </div>
              </FormControl>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

Generic.defaultValue = defaultValue as GenericProps;
