import React from "react";
import { basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView, keymap } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import _omit from "lodash/omit";

export interface UseCodeMirrorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
}
export interface UseCodeMirrorValue {
  ref: (node: HTMLElement | null) => void;
}

export const useCodemirror: (
  props?: UseCodeMirrorProps
) => UseCodeMirrorValue = ({ initialValue = "", onChange = () => {} } = {}) => {
  const [element, setElement] = React.useState<HTMLElement>();

  const ref = React.useCallback<UseCodeMirrorValue["ref"]>((node) => {
    if (!node) return;

    setElement(node);
  }, []);

  React.useEffect(() => {
    if (!element) return;

    const onUpdate = EditorView.updateListener.of((v) => {
      const value = v.state.doc.toString();
      onChange(value);
    });

    const state = EditorState.create({
      extensions: [
        basicSetup,
        javascript(),
        keymap.of([...defaultKeymap, indentWithTab]),
        onUpdate,
      ],
    });

    const view = new EditorView({
      state,
      parent: element,
    });
    const transaction = view.state.update({
      changes: { from: 0, to: state.doc.length, insert: initialValue },
    });
    const update = view.state.update(transaction);
    view.update([update]);

    return () => view.destroy();
  }, [element]);

  return { ref };
};
