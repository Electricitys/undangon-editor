import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

export interface BoxSizingProps {
  width: number;
  height: number;
}

const defaultValue: Partial<BoxSizingProps> = {};

export const BoxSizing = () => {
  const form = useForm();
  return (
    <div>
      <Form {...form}>
        <div className="flex">
          <div>W:</div>
          <Input placeholder="height" />
        </div>
      </Form>
    </div>
  );
};

BoxSizing.defaultValue = defaultValue as BoxSizingProps;
