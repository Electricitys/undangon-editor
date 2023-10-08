"use client";

import _pick from "lodash/pick";
import _set from "lodash/set";
import { BoxSizing } from "../../Settings/BoxSizing";
import { Spacing } from "../../Settings/Spacing";
import { ClassList } from "../../Settings/ClassList";
import { PanelSection } from "../../Viewport/PanelSection";
import { useNode } from "@craftjs/core";
import React from "react";
import { Sources } from ".";
import { CloudImagePicker } from "./CloudImagePicker";
import { useClient } from "@/components/client";
import { useParams } from "next/navigation";

export const ImageSettings = () => {
  const {
    id,
    actions: { setProp },
    values,
  } = useNode((node) => ({
    values: _pick(node.data.props, ["image"]),
  }));

  const _setProps = React.useCallback(
    (path: string, raw: Sources) => {
      setProp((props: any) => _set(props, path, raw), 1000);
    },
    [setProp]
  );

  const client = useClient();
  const params = useParams();

  return (
    <>
      <PanelSection text="Attributes">
        <CloudImagePicker
          value={values["image"].value}
          folders={[
            {
              name: "Template",
              folder: `/templates/${params.id}`,
            },
            {
              name: "User",
              folder: `/user/${client.account?.id}`,
            },
          ]}
          onChange={(img) =>
            _setProps("image", {
              type: "image",
              value: img,
            })
          }
        />
      </PanelSection>
      <PanelSection text="Box">
        <BoxSizing />
        <Spacing />
      </PanelSection>
      <PanelSection text="Class List" separator={false}>
        <ClassList />
      </PanelSection>
    </>
  );
};
