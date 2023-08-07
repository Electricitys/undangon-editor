"use client";

import { useEditor, useNode } from "@craftjs/core";
import { ROOT_NODE } from "@craftjs/utils";
import { ReactElement, useCallback, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { getCloneTree } from "../utils/getCloneTree";
import {
  ArrowUpIcon,
  CopyIcon,
  DragHandleDots2Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { styled } from "@stitches/react";

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
  } = useNode((node) => ({
    isHover: node.events.hovered,
    dom: node.dom,
    name: node.data.custom.displayName || node.data.displayName,
    duplicatable: query.node(node.id).isDeletable(),
    moveable: query.node(node.id).isDraggable(),
    deletable: query.node(node.id).isDeletable(),
    parent: node.data.parent,
    props: node.data.props,
  }));

  useEffect(() => {
    if (dom) {
      if (isActive || isHover) dom.classList.add("component-selected");
      else dom.classList.remove("component-selected");
    }
  }, [dom, isActive, isHover]);

  const getPos = useCallback((dom: HTMLElement) => {
    const { top, left, bottom } = dom
      ? dom.getBoundingClientRect()
      : { top: 0, left: 0, bottom: 0 };
    return {
      top: `${top > 0 ? top : bottom}px`,
      left: `${left}px`,
    };
  }, []);

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

  return (
    <>
      {isHover || isActive
        ? ReactDOM.createPortal(
            <IndicatorDiv
              ref={currentRef as any}
              className="bg-blue-400 px-2 py-1"
              style={{
                left: getPos(dom as any).left,
                top: getPos(dom as any).top,
                zIndex: 9999,
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
                          <Button>
                            <CopyIcon color="white" />
                          </Button>
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
                          <Button>
                            <TrashIcon color="white" />
                          </Button>
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
            </IndicatorDiv>,
            document.querySelector(".page-container") as any
          )
        : null}
      {render}
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
