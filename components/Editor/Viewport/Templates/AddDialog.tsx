import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEditor } from "@craftjs/core";
import { useFormik } from "formik";
import React from "react";
import { Template } from "../../Nodes";
import { Label } from "@/components/ui/label";

export const AddTemplateDialog: React.FC<{
  onSubmit: (name: string) => void;
}> = ({ onSubmit }) => {
  const { selected } = useEditor((state) => {
    const [currentNodeId] = state.events.selected;
    const currentNode = state.nodes[currentNodeId];
    let selected;
    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: currentNode.data.custom.name || currentNode.data.name,
        props: currentNode.data.props,
        type: currentNode.data.custom.type,
        node: currentNode,
        isTemplateNode: currentNode.data.type === Template,
      };
    }
    return { selected };
  });
  const { handleSubmit, handleChange, values } = useFormik({
    initialValues: { name: "" },
    onSubmit: (values, { resetForm }) => {
      onSubmit(values.name);
      resetForm();
    },
  });
  return (
    <>
      <DialogHeader>
        <DialogTitle>Add Node</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center mb-4">
          <Label className="w-1/4">Name</Label>
          <div style={{ width: "75%", marginTop: 0 }}>
            <Input
              name="name"
              defaultValue={values.name}
              onChange={handleChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button className="w-full" type="submit">
            Create Template
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};
