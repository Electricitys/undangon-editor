import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { getCloneTree } from "../../utils/getCloneTree";
import { useEditor } from "@craftjs/core";
import { useLayer } from "@craftjs/layers";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { Key, useCallback } from "react";

export const AddNodeAction = () => {
  const { id } = useLayer();
  const { actions, query, selected } = useEditor((state, query) => ({
    nodes: state.nodes,
    selected: query.node(id),
  }));

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleAction = (type: "before" | "after" | "child") => {
    // const freshNode = getCloneTree(query, id);
    // const node = selected.get();
    // const parent = query.node(node.data.parent as any).get();
    // const indexOf = parent.data.nodes.indexOf(id);

    // switch (type) {
    //   case "before":
    //     actions.addNodeTree(freshNode, parent.id, indexOf);
    //     break;
    //   case "after":
    //     actions.addNodeTree(freshNode, parent.id, indexOf + 1);
    //     break;
    //   case "child":
    //     actions.addNodeTree(freshNode, id);
    //     break;
    // }
    setIsDialogOpen(true);
  };

  const form = useForm({
    defaultValues: {
      type: "tag",
      component: "",
      tag: "div",
      props: [
        {
          name: "",
          value: "",
        },
      ],
    },
  });

  const handleOnSubmit: SubmitHandler<any> = (values) => {
    form.reset();
    setIsDialogOpen(false);
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "props",
  });

  const PropsField = () => {
    return (
      <div className="flex mb-4">
        <div className="w-1/4 mt-4">Props</div>
        <div style={{ width: "75%", marginTop: 0 }}>
          {fields.map((field, index) => (
            <div key={field.id} className={`flex mb-2`}>
              <div style={{ width: "25%" }}>
                <Input
                  placeholder="name"
                  className="rounded-e-none"
                  {...form.register(`props.${field.id as any}.name`)}
                />
              </div>
              <div style={{ width: "75%" }}>
                <Input
                  placeholder="value"
                  className={`rounded-none border-x-0`}
                  {...form.register(`props.${field.id as any}.value`)}
                />
              </div>
              <Button
                disabled={index === 0}
                variant={"outline"}
                className="rounded-b-none rounded-s-none"
                size={"icon"}
                onClick={() => {
                  remove(index);
                }}
              >
                <Cross2Icon />
              </Button>
            </div>
          ))}
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              append({ name: "", value: "" });
            }}
          >
            Add Field
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={"sm"}
            variant={"ghost"}
            className="hover:bg-gray-200 p-0 h-7 w-7"
          >
            <PlusIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {id !== "ROOT" && (
            <DropdownMenuItem onClick={() => handleAction("before")}>
              <span>Add Before</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => handleAction("child")}>
            <span>Add Child</span>
          </DropdownMenuItem>
          {id !== "ROOT" && (
            <DropdownMenuItem onClick={() => handleAction("after")}>
              <span>Add After</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Node</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)}>
              <FormField
                name={"type"}
                render={({ field: tabField }) => (
                  <Tabs ref={tabField.ref} onChange={tabField.onChange}>
                    <FormItem className="flex items-center mb-4">
                      <FormLabel className="w-1/4">Type</FormLabel>
                      <div style={{ width: "75%", marginTop: 0 }}>
                        <FormControl>
                          <TabsList className="!mt-0">
                            <TabsTrigger value="tag">Tag</TabsTrigger>
                            <TabsTrigger value="component">
                              Component
                            </TabsTrigger>
                            <TabsTrigger value="slot">Slot</TabsTrigger>
                          </TabsList>
                        </FormControl>
                      </div>
                    </FormItem>
                    <TabsContent value={"tag"}>
                      <FormField
                        name={"tag"}
                        render={({ field }) => (
                          <FormItem className="flex items-center mb-4">
                            <FormLabel className="w-1/4">Tag</FormLabel>
                            <div style={{ width: "75%", marginTop: 0 }}>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <PropsField />
                    </TabsContent>
                    <TabsContent value={"component"}>
                      <FormField
                        name={"component"}
                        render={({ field }) => (
                          <FormItem className="flex items-center mb-4">
                            <FormLabel className="w-1/4">Component</FormLabel>
                            <div style={{ width: "75%", marginTop: 0 }}>
                              <FormControl>
                                <Select {...field}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select component" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Coba">Coba</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <PropsField />
                    </TabsContent>
                  </Tabs>
                )}
              />
              <DialogFooter>
                <Button className="w-full" type="submit">
                  Add Node
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
