import { Button } from "@/components/ui/button";
import { useNode } from "@craftjs/core";
import { PanelSection } from "../Viewport/PanelSection";

export const DebugSetting = () => {
  const { id, values } = useNode((node) => ({
    values: node.data.props,
  }));

  if (process.env.NODE_ENV === "production") return null;

  return (
    <PanelSection text="DEBUG">
      <div className="px-3">
        <Button
          className="w-full"
          onClick={() => {
            console.log(id, values);
          }}
        >
          Log Current Properties
        </Button>
      </div>
    </PanelSection>
  );
};
