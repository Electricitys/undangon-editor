"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNode } from "@craftjs/core";
import { Cross1Icon } from "@radix-ui/react-icons";
import _pick from "lodash/pick";
import _set from "lodash/set";
import { useForm } from "react-hook-form";

type ConditionalClass = {
  className: string;
  condition: string;
};

export type ClassListProps = ConditionalClass[];

const defaultValue: Partial<ClassListProps> = [];

export const ClassList = () => {
  const {
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _pick(node.data.props, ["classList"]),
  }));

  const form = useForm({
    defaultValues: {
      className: "",
    },
  });

  const handleAddClassName = (values: { className: string }) => {
    setProp((props: { classList: ClassListProps }) =>
      _set(props, "classList", [
        ...props.classList,
        {
          className: values.className,
        },
      ])
    );
    form.reset();
  };

  const classList = values.classList as ClassListProps;

  return (
    <div className="px-1">
      <div className="px-1">
        <div className="-mx-1">
          {classList.map(({ className }) => (
            <Badge key={className} className="pr-0 py-0 mb-2 mx-1">
              <span>{className}</span>
              <Button
                variant={"ghost"}
                size={"icon"}
                className="rounded-full h-6 w-6 ml-2"
                onClick={() => {
                  setProp((props: { classList: ClassListProps }) =>
                    _set(
                      props,
                      "classList",
                      props.classList.filter((c) => c.className !== className)
                    )
                  );
                }}
              >
                <Cross1Icon height={10} width={10} />
              </Button>
            </Badge>
          ))}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddClassName)}>
            <FormField
              control={form.control}
              name="className"
              render={({ field }) => (
                <FormControl>
                  <div className="flex">
                    <Input
                      id="className"
                      placeholder="Type classname here"
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
    </div>
  );
};

ClassList.defaultValue = defaultValue as ClassListProps;
