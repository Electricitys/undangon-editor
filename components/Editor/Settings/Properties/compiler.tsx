import jexl from "jexl";
import { Context } from "jexl/Expression";

const compileProperties = (props: Record<string, any>, {
  type
}: {
  type: string;
}) => {
  let result: any = { ...props };

  if(type === "TemplateNode")  {
    let _node = {
      id: id,
      data: 
    }
  }
};

const compileProps = (value: string, context: Context = {}) => {
  let result = value || "null";
  const expr = jexl.createExpression(result);
  try {
    result = expr.evalSync(context);
  } catch (err) {}
  return result;
};
