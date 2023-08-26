import { PanelSection } from "../../Viewport/PanelSection";
import { Spacing } from "../../Settings/Spacing";
import { ClassList } from "../../Settings/ClassList";
import { Typography } from "../../Settings/Typogrphy";

export const TextSettings = () => {

  return (
    <>
      <PanelSection text="Typography">
        <Typography />
      </PanelSection>
      <PanelSection text="Spacing">
        <Spacing />
      </PanelSection>
      <PanelSection text="Class List" separator={false}>
        <ClassList />
      </PanelSection>
    </>
  );
};
