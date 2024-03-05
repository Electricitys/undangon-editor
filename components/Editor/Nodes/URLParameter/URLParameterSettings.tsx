import { PanelSection } from "../../Viewport/PanelSection";
import { useNode } from "@craftjs/core";
import _pick from "lodash/pick";
import _set from "lodash/set";
import _get from "lodash/get";
import { Input } from "@/components/ui/input";

export const URLParameterSettings = () => {
  const {
    id,
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _pick(node.data.props, ["fieldName"]),
  }));

  return (
    <>
      <PanelSection text="Properties">
        <div className="grid grid-cols-12 pb-2 px-2">
          <div className="px-1 col-span-10">
            <Input
              placeholder="Type the field name"
              value={_get(values, "fieldName")}
              onChange={(e) => {
                setProp((p: any) => _set(p, "fieldName", e.target.value), 1000);
              }}
            />
          </div>
          <div className="px-1 col-span-2"></div>
        </div>
      </PanelSection>
    </>
  );
};
