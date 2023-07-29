import { useNode } from "@craftjs/core";
import { ColorPicker } from "components/ColorPicker";
import { SettingSection } from "components/editor/Sidepanel/SettingPanel/SettingSection";
import { Box, Flex } from "components/Grid";
import _pick from "lodash/pick";
import _get from "lodash/get";
import _set from "lodash/set";
import { CSSUnitInput } from "../Container/CSSUnitInput";
import unitsCss from "units-css";
import { FontPicker } from "components/FontPicker";
import { FormField } from "@/components/ui/form";

export const TextSettings = () => {
  const {
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _pick(node.data.props, [
      "lineHeight",
      "textAlign",
      "fontWeight",
      "textShadow",
      "fontSize",
      "fontFamily",
      "color",
      "margin",
      "padding",
    ]),
  }));

  return (
    <>
      <SettingSection
        defaultOpen={true}
        text="Typography"
        label={({ fontSize, fontFamily, textAlign, fontWeight, lineHeight }) =>
          `${fontFamily}, ${fontSize}, ${textAlign}, ${fontWeight}, ${lineHeight}`
        }
        props={[
          "fontSize",
          "fontFamily",
          "textAlign",
          "fontWeight",
          "lineHeight",
        ]}
      >
        <FormField label="Font Family">
          <FontPicker
            activeFontFamily={values.fontFamily}
            limit={150}
            onChange={(nextFamily) =>
              setProp((props) => (props.fontFamily = nextFamily.family))
            }
          />
        </FormGroup>
        <Flex mx={-2}>
          <Box w="50%" px={2}>
            <FormGroup label="Font Size">
              <InputGroup
                type="number"
                value={values.fontSize || ""}
                onChange={(e) => {
                  setProp((props) => (props.fontSize = Number(e.target.value)));
                }}
              />
            </FormGroup>
          </Box>
          <Box px={2}>
            <FormGroup label="Line Height">
              <InputGroup
                type="number"
                value={values.lineHeight || ""}
                onChange={(e) => {
                  setProp(
                    (props) => (props.lineHeight = Number(e.target.value))
                  );
                }}
              />
            </FormGroup>
          </Box>
        </Flex>
        <Flex>
          <Box sx={{ width: "50%" }}>
            <RadioGroup
              label="Align"
              selectedValue={values.textAlign || ""}
              onChange={(e) => {
                setProp((props) => (props.textAlign = e.target.value));
              }}
              options={[
                { label: "Left", value: "left" },
                { label: "Center", value: "center" },
                { label: "Right", value: "right" },
              ]}
            />
          </Box>
          <Box>
            <RadioGroup
              label="Weight"
              selectedValue={values.fontWeight || ""}
              onChange={(e) => {
                setProp((props) => (props.fontWeight = e.target.value));
              }}
            >
              <Radio label="Regular" value="normal" />
              <Radio label="Medium" value="500" />
              <Radio label="Bold" value="700" />
            </RadioGroup>
          </Box>
        </Flex>
      </SettingSection>
      <SettingSection
        text="Margin"
        label={({ margin }) =>
          `${margin[0]}, ${margin[1]}, ${margin[2]}, ${margin[3]}`
        }
        props={["margin"]}
      >
        <Flex flexWrap="wrap" mx={-1}>
          {[
            {
              label: "marginTop",
              icon: {
                as: Icon,
                icon: "chevron-backward",
                sx: { transform: "rotate(90deg)" },
              },
            },
            {
              label: "marginRight",
              icon: { as: Icon, icon: "chevron-forward" },
            },
            {
              label: "marginBottom",
              icon: {
                as: Icon,
                icon: "chevron-forward",
                sx: { transform: "rotate(90deg)" },
              },
            },
            {
              label: "marginLeft",
              icon: {
                as: Icon,
                icon: "chevron-backward",
              },
            },
          ].map(({ icon, label }, idx) => (
            <Box key={idx} width="50%" px={1}>
              <FormGroup>
                <CSSUnitInput
                  iconProps={{
                    icon: <Box {...icon} />,
                  }}
                  label={label}
                  initialValue={unitsCss.parse(
                    _get(values, `margin[${idx}]`) || ""
                  )}
                  onChange={(value) => {
                    setProp((props) => _set(props, `margin[${idx}]`, value));
                  }}
                />
              </FormGroup>
            </Box>
          ))}
        </Flex>
      </SettingSection>
      <SettingSection text="Appearance">
        <FormGroup label="Color">
          <ColorPicker
            value={values.color}
            onChange={(color) => {
              setProp((props) => (props.color = color.hex));
            }}
          />
        </FormGroup>
        <FormGroup label="textShadow">
          <InputGroup
            defaultValue={_get(values, "textShadow") || ""}
            onChange={(e) => {
              setProp(
                (props) => _set(props, "textShadow", e.target.value),
                500
              );
            }}
          />
        </FormGroup>
      </SettingSection>
    </>
  );
};
