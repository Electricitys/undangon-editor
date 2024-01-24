import { Frame, FrameProps as CraftFrameProps, useEditor } from "@craftjs/core";
import React, { useEffect, useState } from "react";
import _omit from "lodash/omit";
import {
  useDebounce,
  useEffectOnce,
  useFirstMountState,
  useList,
  usePrevious,
} from "react-use";
import { ListActions } from "react-use/lib/useList";
import { generateId } from "@/components/utils/generateId";
import { Properties } from "../../Settings/Properties";
import { FrameProps } from ".";
import { Template } from "../Templates";
import _set from "lodash/set";
import { useViewport } from "../useViewport";

export interface ViewportFrameProps extends Partial<CraftFrameProps> {
  initialData?: string;
}
type IFrame = FrameProps & {
  properties?: Properties[];
  handler?: Partial<FrameHandlerProps>;
  defaultMode?: "advanced" | "simple";
  _updatedAt: number;
};
type FrameHandlerProps = {
  onChange(value: string): void;
  onBack(
    targetFrameId: string,
    value: string,
    handler: ViewportFrameValue["frameHelper"]
  ): void;
};
export interface ViewportFrameValue {
  framePanel: [string[], ListActions<string>];
  frames: Record<string, IFrame>;
  frame: IFrame;
  frameHelper: {
    push: (frame: IFrame) => void;
    back: () => void;
    get: (id: string) => IFrame;
    add: (frame: IFrame, active?: boolean) => void;
    remove: (id: string) => void;
    updateFrameAt: (id: string, data: Partial<IFrame>) => void;
    updatePropertyFrameAt: (
      frameId: string,
      propertyIndex: number,
      data: Partial<Properties>
    ) => void;
    update: (id: string, newData: string) => void;
    activeFrame: string;
    setActiveFrame: (id: string, rerender?: boolean) => void;
  };
}

const ViewportFrameContext = React.createContext<ViewportFrameValue>({} as any);

export const ViewportFrameProvider: React.FC<
  React.PropsWithChildren<ViewportFrameProps>
> = ({ children, initialData, ...props }) => {
  const framePanel = useList<string>([]);
  const [frames, setFrame] = React.useState<Record<string, IFrame>>({});
  const [activeFrame, setActiveFrame] = React.useState<string>("");
  const { saveStatus } = useViewport();
  const lastActiveFrame = usePrevious(activeFrame);
  const { store, actions, nodes, query } = useEditor((state, query) => {
    return {
      nodes: query.getSerializedNodes(),
    };
  });

  const backHandler = async () => {
    const frameStack = framePanel[0];
    if (frameStack.length < 1) return;
    const lastIndex = frameStack.length - 1;
    const lastItem = frameStack[lastIndex];
    const item = frameStack[lastIndex - 1];

    if (frames[lastItem].handler?.onBack)
      await frames[lastItem].handler!.onBack!(
        item,
        frames[lastItem].content,
        frameHelper
      );

    await framePanel[1].removeAt(lastIndex);
    await frameHelper.remove(lastItem);
    await setActiveFrame(item);
    await actions.deserialize(frameHelper.get(item).content);
  };

  const frameHelper: ViewportFrameValue["frameHelper"] = {
    activeFrame,
    setActiveFrame: (id, rerender = true) => {
      if (activeFrame === id) return;
      setActiveFrame(id);
      if (rerender) {
        actions.deserialize(frames[id].content);
      }
    },
    get: (id: string) => {
      return frames[id];
    },
    add: (frame: IFrame, active = false) => {
      const { id } = frame;
      setFrame((f) => ({
        ...f,
        [id]: { ...frame },
      }));
      if (active) setActiveFrame(id);
    },
    push: (frame) => {
      frameHelper.add(frame, true);
      framePanel[1].push(frame.id);
      if (frame.content) actions.deserialize(frame.content);
    },
    back: backHandler,
    remove: async (id) => {
      await setFrame((frame) => _omit(frame, id));
    },
    async updateFrameAt(id, data) {
      await setFrame((frame) => {
        frame[id] = {
          ...frame[id],
          ...data,
        };
        return { ...frame };
      });
    },
    async updatePropertyFrameAt(frameId, id, data) {
      await setFrame((frame) => {
        const f = { ...frame[frameId] };
        const lastProp = f.properties[id];
        _set(f, `properties[${id}]`, {
          ...lastProp,
          ...data,
          _updatedAt: Date.now(),
        });
        return {
          ...frame,
          [frameId]: {
            ...f,
            _updatedAt: Date.now(),
          },
        };
      });
    },
    update: async (id, newData) => {
      await setFrame((frame) => {
        frame[id] = {
          ...frame[id],
          content: newData,
          _updatedAt: Date.now(),
        };
        return { ...frame };
      });
    },
  };
  // Watch nodes changes
  useDebounce(
    () => {
      // Save updated node
      if (store.history.timeline.length > 0) {
        if (lastActiveFrame !== activeFrame) return;
        frameHelper.update(activeFrame, query.serialize());
      }
    },
    1000,
    [activeFrame, nodes, store.history.timeline]
  );

  const isFirst = useFirstMountState();

  useDebounce(
    () => {
      if (!isFirst) return;
      saveStatus.setUnsave(true);
    },
    1000,
    [isFirst, store.history.timeline.length]
  );

  return (
    <ViewportFrameContext.Provider
      value={{
        framePanel,
        frame: frames[activeFrame],
        frames,
        frameHelper,
      }}
    >
      {children}
    </ViewportFrameContext.Provider>
  );
};

export const ViewportFrame: React.FC<
  React.PropsWithChildren<
    Partial<
      CraftFrameProps & {
        templates: FrameProps["templates"];
        properties: FrameProps["properties"];
      }
    >
  >
> = (props) => {
  const { frames, frameHelper } = useViewportFrame();

  const [pushFrameInit, cancel] = useDebounce(() => {
    if (typeof frames["ROOT_FRAME"] !== "undefined") {
      frameHelper.update("ROOT_FRAME", props.data as string);
    } else {
      frameHelper.push({
        id: "ROOT_FRAME",
        name: "App",
        content: props.data as string,
        templates: props.templates || [],
        properties: props.properties || [],
        _updatedAt: Date.now(),
      });
    }
  }, 100);

  useEffectOnce(() => {
    pushFrameInit();
  });

  if (typeof frames["ROOT_FRAME"] === "undefined") return null;

  return <Frame {...props} data={props.data} />;
};

export const useViewportFrame = (): ViewportFrameValue => {
  const viewport = React.useContext(ViewportFrameContext);
  return viewport;
};

interface ViewportFrameTemplatesValue {
  templates: Template[];
  helper: {
    get: (id: string) => Template | undefined;
    push: (template: Template) => void;
    remove: (id: number) => void;
    update: (id: string, template: Partial<Template>) => void;
  };
}

export const useViewportFrameTemplates = (): ViewportFrameTemplatesValue => {
  const { frame, frameHelper } = useViewportFrame();
  const frameId = frame?.id;
  const templates = frame?.templates || [];

  useEffectOnce(() => {
    const presetOnLocal = window.localStorage.getItem("manjo.presets");
    if (!presetOnLocal) return;
    frameHelper.updateFrameAt(frameId, {
      templates: JSON.parse(presetOnLocal),
      _updatedAt: Date.now(),
    });
  });

  return {
    templates: [...templates.filter(({ id }) => frameId !== id)],
    helper: {
      get: (id) => {
        return templates.find((template) => template.id === id);
      },
      push: (template) => {
        const newTemplates = [...templates, template];
        window.localStorage.setItem(
          "manjo.presets",
          JSON.stringify(newTemplates)
        );
        frameHelper.updateFrameAt(frame.id, {
          templates: newTemplates,
          _updatedAt: Date.now(),
        });
      },
      remove: (id) => {
        let newTemplates = [...templates];
        newTemplates.splice(id, 1);
        window.localStorage.setItem(
          "manjo.presets",
          JSON.stringify(newTemplates)
        );
        frameHelper.updateFrameAt(frame.id, {
          templates: newTemplates,
          _updatedAt: Date.now(),
        });
      },
      update: async (id, template) => {
        const targetId = templates.findIndex(({ id: i }) => id === i);
        let newTemplates = [...templates];
        newTemplates[targetId] = {
          ...templates[targetId],
          ...template,
        };
        window.localStorage.setItem(
          "manjo.presets",
          JSON.stringify(newTemplates)
        );
        frameHelper.updateFrameAt(frameId, {
          templates: frame.templates,
          _updatedAt: Date.now(),
        });
        // localTemplatesHandler.setItem(targetId, { ...newTemplates[targetId] });
      },
    },
  };
};
