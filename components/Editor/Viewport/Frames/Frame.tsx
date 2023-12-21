import { Frame, FrameProps as CraftFrameProps, useEditor } from "@craftjs/core";
import React, { useState } from "react";
import _omit from "lodash/omit";
import { useDebounce, useEffectOnce, useList, usePrevious } from "react-use";
import { ListActions } from "react-use/lib/useList";
import { generateId } from "@/components/utils/generateId";
import { Properties } from "../../Settings/Properties";
import { FrameProps } from ".";
import { Template } from "../Templates";
import _set from "lodash/set";

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
  const { frameHelper } = useViewportFrame();
  useEffectOnce(() => {
    frameHelper.push({
      id: generateId(),
      name: "App",
      content: props.data as string,
      templates: props.templates || [],
      properties: props.properties || [],
      _updatedAt: Date.now(),
    });
  });
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
  };
}

export const useViewportFrameTemplates = (): ViewportFrameTemplatesValue => {
  const { frame, frameHelper } = useViewportFrame();
  const templates = frame?.templates || [];
  const [localTemplates, setLocalTemplates] = useState<Template[]>([]);
  useEffectOnce(() => {
    const presetOnLocal = window.localStorage.getItem("manjo.presets");
    if (!presetOnLocal) return;
    setLocalTemplates(JSON.parse(presetOnLocal));
  });
  return {
    templates: localTemplates,
    helper: {
      get: (id) => {
        return frame.templates.find((template) => template.id === id);
      },
      push: function (template: Template): void {
        window.localStorage.setItem(
          "manjo.presets",
          JSON.stringify([...templates, template])
        );
        setLocalTemplates([...templates, template]);
        frameHelper.updateFrameAt(frame.id, {
          templates: [...templates, template],
        });
      },
    },
  };
};
