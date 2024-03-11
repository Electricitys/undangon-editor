import _pick from "lodash/pick";
import _get from "lodash/get";
import _set from "lodash/set";
import { PanelSection } from "../../Viewport/PanelSection";
import { Generic } from "../../Settings/Generic";
import { Input } from "@/components/ui/input";
import { useNode } from "@craftjs/core";
import { FileUpload } from "@/components/ui/file_upload";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const AudioSettings = () => {
  const {
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _pick(node.data.props, ["src"]),
  }));

  return (
    <>
      <PanelSection text="Properties">
        <div className="px-3">
          <Dialog open={true}>
            <DialogTrigger asChild>
              <Button>Choose File</Button>
            </DialogTrigger>
            <DialogContent>
              <FileUpload />
            </DialogContent>
          </Dialog>
        </div>
        <div className="px-3">
          <Input
            placeholder="Type the field name"
            value={_get(values, "src")}
            onChange={(e) => {
              setProp((p: any) => _set(p, "src", e.target.value), 1000);
            }}
          />
        </div>
      </PanelSection>
      <PanelSection text="Generic Properties">
        <Generic />
      </PanelSection>
    </>
  );
};
