import _pick from "lodash/pick";
import _get from "lodash/get";
import _set from "lodash/set";
import { PanelSection } from "../../Viewport/PanelSection";
import { Generic } from "../../Settings/Generic";
import { Input } from "@/components/ui/input";
import { useNode } from "@craftjs/core";
import Expression from "jexl/Expression";
import { ExpressionInput } from "@/components/ui/expression-input";

export const ScriptSettings = () => {
  const {
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _pick(node.data.props, ["content"]),
  }));

  return (
    <>
      <PanelSection text="Properties">
        <div className="px-3">
          <ExpressionInput
            placeholder="Type the field name"
            defaultValue={_get(values, "content")}
            onChange={(value) => {
              setProp((p: any) => _set(p, "content", value), 2000);
            }}
            variables={[]}
          />
        </div>
      </PanelSection>
    </>
  );
};
