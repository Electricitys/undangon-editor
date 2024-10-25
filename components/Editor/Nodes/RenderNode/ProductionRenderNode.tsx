"use client";

import { NodeElement, NodeId, useEditor, useNode } from "@craftjs/core";
import React, { ReactElement } from "react";
import { TemplateNode } from "../Template";
import { useTemplateNodeManager } from "../Template/useTemplateNodeManager";
import { Context } from "jexl/Expression";
import jexl from "jexl";
import { useViewportFrame } from "../../Viewport/Frames/Frame";
import _debounce from "lodash/debounce";
import _set from "lodash/set";
import _fpset from "lodash/fp/set";
import _merge from "lodash/merge";
import _get from "lodash/get";
import { useDebouncedValue } from "@mantine/hooks";
import * as ResolvedNodes from "..";

const debounceFunction = _debounce((fn: () => void) => {
  return fn();
}, 100);

export const ProductionRenderNode = ({ render }: { render: ReactElement }) => {
  const { id } = useNode();
  const { query } = useEditor();

  const { props, type, nodes } = useNode((node) => ({
    props: node.data.props,
    type: node.data.type,
    nodes: node.data.nodes,
  }));

  const { setTemplate } = useTemplateNodeManager();
  const { frame } = useViewportFrame();

  const [frameUpdatedAt] = useDebouncedValue(_get(frame, "_updatedAt"), 1000);

  const ElementRender = React.useMemo(() => {
    let children = props.children;
    if (nodes && nodes.length > 0) {
      children = (
        <React.Fragment>
          {nodes.map((id: NodeId) => (
            <NodeElement id={id} key={id} />
          ))}
        </React.Fragment>
      );
    }

    const SerializedNode = query.node(id).toSerializedNode();

    var renderProps: any = { ...props };
    if (type === TemplateNode) {
      let _node = {
        id: id,
        data: SerializedNode,
        _hydrationTimestamp: query.node(id).get()._hydrationTimestamp,
      };
      debounceFunction(() => {
        setTemplate(id, _node);
      });

      renderProps = {
        ...props,
        _node,
      };
    } else {
      const functionProps = (
        Object.entries(ResolvedNodes).find(
          ([key]) => key === (SerializedNode.type as any).resolvedName
        ) as any
      )[1].craft?.custom.functionProps;
      if (functionProps) {
        for (let props of functionProps) {
          const path = typeof props === "string" ? props : props.path;
          let inputValue = _get(renderProps, path);
          const inputType = _get(renderProps, props.name).type;
          if (["expression"].indexOf(inputType) < 0)
            inputValue = `"${inputValue}"`;
          const compiledProps = compileProps(
            inputValue,
            frame.properties.reduce((p, c) => {
              let value = c.value;
              if (["text", "color", "image"].indexOf(c.type) > -1) {
                value = `"${value}"`;
              }
              return {
                ...p,
                [`$${c.name}`]: compileProps(value),
              };
            }, {})
          );

          renderProps = _fpset(path, compiledProps, renderProps);
        }
      }
    }

    return React.createElement(type, renderProps, children);
  }, [type, props, nodes, frameUpdatedAt]);

  return <>{ElementRender}</>;
};

const compileProps = (value: string, context: Context = {}) => {
  let result = value || "null";
  const expr = jexl.createExpression(result);
  try {
    result = expr.evalSync(context);
  } catch (err) {}
  return result;
};
