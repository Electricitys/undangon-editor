"use client";

import { AuthenticationResponse, PresetSchema } from "@/components/interfaces";
import { Button, Select, TextInput } from "@mantine/core";
import { HttpError, useGetIdentity } from "@refinedev/core";
import { Edit, useForm, useSelect } from "@refinedev/mantine";
import { IconEdit } from "@tabler/icons-react";
import React from "react";
import slugify from "slugify";

type PresetData = Pick<PresetSchema, "label" | "type_id" | "thumbnail_url">;

const PresetEdit: React.FC = () => {
  const {
    getInputProps,
    saveButtonProps,
    refineCore: { queryResult },
  } = useForm<PresetSchema, HttpError, PresetData>({
    initialValues: {
      label: "",
      type_id: 0,
      thumbnail_url: "",
    },
  });

  const presetData = queryResult?.data?.data;

  const { selectProps: typeSelectProps } = useSelect({
    resource: "preset_types",
    defaultValue: presetData?.type_id,
    optionLabel: "label",
  });

  const presetUrl = React.useMemo(() => {
    // const auth = feathers.get("authentication");
    return `/e/preset/${presetData && slugify(presetData?.label)}/${
      presetData?.id
    }`;
  }, [queryResult]);

  return (
    <Edit
      saveButtonProps={saveButtonProps}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <Button
            component="a"
            href={presetUrl}
            variant="outline"
            size="sm"
            leftIcon={<IconEdit size={18} />}
          >
            Edit Preset
          </Button>
        </>
      )}
    >
      <TextInput mt="sm" label="Name" {...getInputProps("label")} />
      <Select
        mt="sm"
        label="Type"
        withinPortal
        {...getInputProps("type_id")}
        {...typeSelectProps}
        filterDataOnExactSearchMatch={false}
      />
    </Edit>
  );
};

export default PresetEdit;
