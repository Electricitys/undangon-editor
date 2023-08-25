import { CSSUnitInput } from "@/components/ui/css_unit_input";

export const ContainerSettings = () => {
  return (
    <div>
      <CSSUnitInput
        label={"Width"}
        disabled={false}
        icon={"M"}
        onChange={function (value: any): void {
          console.log(value);
        }}
        initialValue={{
          value: undefined,
          unit: undefined,
        }}
      />
    </div>
  );
};
