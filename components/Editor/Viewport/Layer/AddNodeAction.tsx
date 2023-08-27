import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { Element, Node, useEditor } from "@craftjs/core";
import { useLayer } from "@craftjs/layers";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { FormikConfig, useFormik } from "formik";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { Label } from "@/components/ui/label";
import { uniqueId } from "lodash";
import { NativeTag } from "../../Nodes";

type FormProps = {
  target: "before" | "after" | "child";
  type: string;
  component: string;
  tag: string;
  props: {
    id: string;
    name: string;
    value: string;
  }[];
};

export const AddNodeAction = () => {
  const { id } = useLayer();
  const editor = useEditor((state, query) => ({
    nodes: state.nodes,
    selected: query.node(id),
  }));
  const { actions, query, selected } = editor;

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const onSubmit: FormikConfig<FormProps>["onSubmit"] = (
    values,
    { resetForm }
  ) => {
    console.log(values);

    const freshNode = query
      .parseReactElement(
        React.createElement(Element, {
          is: NativeTag,
          canvas: true,
          custom: {
            name: values.tag,
          },
        })
      )
      .toNodeTree();

    const node = selected.get();
    let parent: Node = {} as any;
    let indexOf: number = 0;
    if (["before", "after"].indexOf(values.target) > -1) {
      parent = query.node(node.data.parent as any).get();
      indexOf = parent.data.nodes.indexOf(id);
    }

    switch (values.target) {
      case "before":
        actions.addNodeTree(freshNode, parent.id, indexOf);
        break;
      case "after":
        actions.addNodeTree(freshNode, parent.id, indexOf + 1);
        break;
      case "child":
        actions.addNodeTree(freshNode, id);
        break;
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const formik = useFormik<FormProps>({
    initialValues: {
      target: "child",
      type: "tag",
      component: "",
      tag: "div",
      props: [
        {
          id: uniqueId("props_"),
          name: "",
          value: "",
        },
      ],
    },
    onSubmit,
  });

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
    formik.setFieldValue("target", type);
    setIsDialogOpen(true);
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
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          formik.resetForm();
        }}
      >
        <DialogContent
          tabIndex={-1}
          onFocus={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Add Node</DialogTitle>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit}>
            <Tabs
              defaultValue={formik.values.type}
              onValueChange={(value) => {
                formik.setFieldValue("type", value);
              }}
            >
              <div className="flex items-center mb-4">
                <Label className="w-1/4">Type</Label>
                <div style={{ width: "75%", marginTop: 0 }}>
                  <TabsList className="!mt-0" onChange={(e) => console.log(e)}>
                    <TabsTrigger value="tag">Tag</TabsTrigger>
                    <TabsTrigger value="component">Component</TabsTrigger>
                    <TabsTrigger value="slot">Slot</TabsTrigger>
                  </TabsList>
                </div>
              </div>
              <TabsContent value={"tag"} tabIndex={-1}>
                <div className="flex items-center mb-4">
                  <Label className="w-1/4">Tag</Label>
                  <div style={{ width: "75%", marginTop: 0 }}>
                    <Input
                      name="tag"
                      defaultValue={formik.values.tag}
                      onChange={(e) =>
                        formik.setFieldValue("tag", e.target.value)
                      }
                    />
                  </div>
                </div>
                <PropsField formik={formik} />
              </TabsContent>
              <TabsContent value={"component"} tabIndex={-1}>
                <div className="flex items-center mb-4">
                  <Label className="w-1/4">Component</Label>
                  <div style={{ width: "75%", marginTop: 0 }}>
                    <Select
                      onValueChange={(value) => {
                        formik.setFieldValue("component", value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select component" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Coba">Coba</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <PropsField formik={formik} />
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button className="w-full" type="submit">
                Add Node
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

const PropsField = ({ formik }: { formik: any }) => {
  return (
    <div className="flex mb-4">
      <div className="w-1/4 mt-4">Props</div>
      <div style={{ width: "75%", marginTop: 0 }}>
        {formik.values.props.map((field: any, index: number) => {
          return (
            <div key={field.id} className={`flex mb-2`}>
              <div style={{ width: "25%" }}>
                <Input
                  id={`props.${index}.name`}
                  name={`props.${index}.name`}
                  placeholder="name"
                  className="rounded-e-none"
                  onChange={(e) =>
                    formik.setFieldValue(`props.${index}.name`, e.target.value)
                  }
                  defaultValue={field.name}
                />
              </div>
              <div style={{ width: "75%" }}>
                <Input
                  id={`props.${index as any}.value`}
                  placeholder="value"
                  className={`rounded-none border-x-0`}
                  defaultValue={field.value}
                  onChange={(e) =>
                    formik.setFieldValue(`props.${index}.value`, e.target.value)
                  }
                />
              </div>
              <Button
                disabled={index === 0}
                variant={"outline"}
                className="rounded-b-none rounded-s-none"
                size={"icon"}
                onClick={() => {
                  formik.setFieldValue(
                    "props",
                    formik.values.props.filter(
                      (_: any, i: number) => i !== index
                    )
                  );
                }}
              >
                <Cross2Icon />
              </Button>
            </div>
          );
        })}
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={() => {
            formik.setFieldValue("props", [
              ...formik.values.props,
              { id: uniqueId("props_"), name: "", value: "" },
            ]);
          }}
        >
          Add Field
        </Button>
      </div>
    </div>
  );
};
