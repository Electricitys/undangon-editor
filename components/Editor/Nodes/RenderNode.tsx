"use client";

import { NodeElement, NodeId, useEditor, useNode } from "@craftjs/core";
import { ROOT_NODE } from "@craftjs/utils";
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import ReactDOM, { render } from "react-dom";
import { getCloneTree } from "../utils/getCloneTree";
import {
  ArrowUpIcon,
  CopyIcon,
  DragHandleDots2Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { styled } from "@stitches/react";
import { TemplateNode } from "./Template";
import { useTemplateNodeManager } from "./Template/useTemplateNodeManager";
import { Context } from "jexl/Expression";
import jexl from "jexl";
import { useViewportFrame } from "../Viewport/Frames/Frame";
import _debounce from "lodash/debounce";
import _set from "lodash/set";
import _fpset from "lodash/fp/set";
import _merge from "lodash/merge";
import _get from "lodash/get";
import { useDebouncedValue } from "@mantine/hooks";
import * as ResolvedNodes from "../Nodes";

const debounceFunction = _debounce((fn: () => void) => {
  return fn();
}, 100);

export const RenderNode = ({ render }: { render: ReactElement }) => {
  const { id } = useNode();
  const currentRef = useRef<HTMLElement>();
  const { actions, query, isActive } = useEditor((_, query) => ({
    isActive: query.getEvent("selected").contains(id),
  }));

  const {
    isHover,
    dom,
    name,
    duplicatable,
    moveable,
    deletable,
    connectors: { drag },
    parent,

    props,
    type,
    nodes,
  } = useNode((node) => ({
    isHover: node.events.hovered,
    dom: node.dom,
    name:
      node.data.custom.name ||
      node.data.custom.displayName ||
      node.data.displayName,
    duplicatable: query.node(node.id).isDeletable(),
    moveable: query.node(node.id).isDraggable(),
    deletable: query.node(node.id).isDeletable(),
    parent: node.data.parent,

    props: node.data.props,
    type: node.data.type,
    nodes: node.data.nodes,
  }));

  useEffect(() => {
    if (dom) {
      if (isActive || isHover) dom.classList.add("component-selected");
      else dom.classList.remove("component-selected");
    }
  }, [dom, isActive, isHover]);

  const getPos = useCallback(
    (dom: HTMLElement): { top: string; left: string } => {
      const { top, left, bottom } = dom
        ? dom.getBoundingClientRect()
        : { top: 0, left: 0, bottom: 0 };
      return {
        top: `${top > 0 ? top : bottom}px`,
        left: `${left}px`,
      };
    },
    []
  );

  const scroll = useCallback(() => {
    const { current: currentDOM } = currentRef;

    if (!currentDOM) return;
    const { top, left } = getPos(dom as HTMLElement);
    currentDOM.style.top = top;
    currentDOM.style.left = left;
  }, [dom, getPos]);

  const duplicateNode = useCallback(
    (nodeId: string) => {
      let freshNode = getCloneTree(query, nodeId);
      actions.addNodeTree(freshNode, parent as any);
    },
    [parent, query]
  );

  useEffect(() => {
    const dom: any = document.querySelector(".editor-renderer");

    dom.addEventListener("scroll", scroll);

    return () => {
      dom.removeEventListener("scroll", scroll);
    };
  }, [scroll]);

  const pos = getPos(dom as any);

  const domDimension: DOMRect = dom
    ? dom?.getBoundingClientRect()
    : ({} as any);

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

  return (
    <>
      {isHover || isActive
        ? ReactDOM.createPortal(
            <>
              <IndicatorDiv
                ref={currentRef as any}
                className="bg-blue-400 px-2 py-1 flex"
                style={{
                  left: pos.left,
                  top: pos.top,
                  zIndex: 40,
                }}
              >
                <div>{name}</div>
                {isActive && (
                  <>
                    {id !== ROOT_NODE && (
                      <div
                        className="ml-2"
                        onClick={() => {
                          actions.selectNode(parent as any);
                        }}
                        title="Select parent"
                      >
                        <ArrowUpIcon color="white" />
                      </div>
                    )}
                    {moveable ? (
                      <div
                        ref={(ref) => drag(ref as any)}
                        className="ml-2"
                        title="Drag"
                      >
                        <DragHandleDots2Icon color="white" />
                      </div>
                    ) : null}
                    {duplicatable ? (
                      <div className="ml-2" title="Duplicate node">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button>
                              <CopyIcon color="white" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>
                              Do you want to duplicate?
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              color="red"
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                duplicateNode(id);
                              }}
                            >
                              Yes
                            </DropdownMenuItem>
                            <DropdownMenuItem>Cancel</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ) : null}
                    {deletable ? (
                      <div className="ml-3" title="Delete node">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button>
                              <TrashIcon color="white" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Are you sure?</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                actions.delete(id);
                              }}
                              color="red"
                            >
                              Yes
                            </DropdownMenuItem>
                            <DropdownMenuItem>Cancel</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ) : null}
                  </>
                )}
              </IndicatorDiv>
              <IndicatorBorderDiv
                style={{
                  top: domDimension.top,
                  left: domDimension.left,
                  width: domDimension.width,
                  height: domDimension.height,
                }}
              />
            </>,
            document.querySelector(".page-container") as any
          )
        : null}
      {ElementRender}
      {/* {render} */}
    </>
  );
};

const IndicatorDiv = styled("div", {
  position: "fixed",

  alignItems: "center",
  marginTop: "-20px",
  fontSize: "10px",
  lineHeight: "10px",
  color: "white",
  height: "20px",

  svg: {
    fill: "#fff",
  },
});

const IndicatorBorderDiv = styled("div", {
  position: "fixed",
  border: "1px dashed red",
  pointerEvents: "none",
});

const compileProps = (value: string, context: Context = {}) => {
  let result = value || "null";
  const expr = jexl.createExpression(result);
  try {
    result = expr.evalSync(context);
  } catch (err) {
    // console.error("RenderNode error while Compiling Props: ", err);
  }
  return result;
};
