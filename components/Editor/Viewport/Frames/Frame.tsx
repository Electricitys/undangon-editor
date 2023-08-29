import { Frame, FrameProps, useEditor } from "@craftjs/core";
import React from "react";
import _omit from "lodash/omit";
import {
  useDebounce,
  useEffectOnce,
  useList,
  usePrevious,
} from "react-use";
import { ListActions } from "react-use/lib/useList";
import { generateId } from "@/components/utils/generateId";

export interface ViewportFrameProps extends Partial<FrameProps> {
  initialData?: string;
}
type IFrame = {
  id: string;
  name: string;
  content: string;
};
export interface ViewportFrameValue {
  framePanel: [string[], ListActions<string>];
  frames: Record<string, IFrame>;
  frame: IFrame;
  frameHelper: {
    push: (frame: IFrame) => void;
    back: () => void;
    add: (frame: IFrame, active?: boolean) => void;
    remove: (name: string) => void;
    update: (name: string, newData: string) => void;
    activeFrame: string;
    setActiveFrame: (name: string, rerender?: boolean) => void;
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

  const frameHelper: ViewportFrameValue["frameHelper"] = {
    activeFrame,
    setActiveFrame: (id, rerender = true) => {
      if (activeFrame === id) return;
      setActiveFrame(id);
      if (rerender) {
        actions.deserialize(frames[id].content);
      }
    },
    add: ({ name, content, id }: IFrame, active = false) => {
      setFrame((frame) => ({
        ...frame,
        [id]: {
          id: id,
          name,
          content,
        },
      }));
      if (active) setActiveFrame(id);
    },
    push: (frame) => {
      frameHelper.add(frame, true);
      framePanel[1].push(frame.id);
      actions.deserialize(frame.content);
    },
    back: () => {
      const frameStack = framePanel[0];
      if (frameStack.length < 1) return;
      const lastIndex = frameStack.length - 1;
      const lastItem = frameStack[lastIndex];
      const item = frameStack[lastIndex - 1];
      framePanel[1].removeAt(lastIndex);
      frameHelper.remove(lastItem);
      setActiveFrame(item);
      actions.deserialize(frames[item].content);
    },
    remove: (name) => {
      setFrame((frame) => _omit(frame, name));
    },
    update: (name, newData) => {
      setFrame((frame) => {
        frame[name] = {
          ...frame[name],
          content: newData,
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
  React.PropsWithChildren<Partial<FrameProps>>
> = (props) => {
  const { frame, frameHelper } = useViewportFrame();
  useEffectOnce(() => {
    frameHelper.push({
      id: generateId(),
      name: "App",
      content: props.data as string,
    });
  });
  return <Frame {...props} data={(frame && frame.content) || props.data} />;
};

export const useViewportFrame = (): ViewportFrameValue => {
  const viewport = React.useContext(ViewportFrameContext);
  return viewport;
};
