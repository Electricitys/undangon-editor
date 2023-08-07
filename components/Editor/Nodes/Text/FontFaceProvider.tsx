"use client";

import React from "react";
import { useDebounce, useList, useQueue } from "react-use";

const FontFaceContext = React.createContext<any>(null);

type FontFaceProviderProps = {
  children: React.ReactNode;
};

export const FontFaceProvider: React.FC<FontFaceProviderProps> = ({
  children,
}) => {
  const [list, { push }] = useList([]);
  const loadQueue = useQueue();

  const loadFactory = async (fontFamily: any) => {
    try {
      const WebFont = await import("webfontloader");
      await WebFont.load({
        google: {
          families: [fontFamily],
        },
      });
      push(fontFamily as never);
    } catch (err) {
      console.error(err);
    }
  };

  const loadFont = async (fontFamily: any) => {
    let item = {
      family: fontFamily,
      call: () => loadFactory(fontFamily),
    };
    await loadQueue.add(item);
  };

  useDebounce(
    async () => {
      if (!loadQueue.first || loadQueue.size === 0) {
        return;
      }
      let isLoaded = list.indexOf((loadQueue.first as any).family as never);
      if (isLoaded < 0) {
        await (loadQueue.first as any).call();
      }
      await loadQueue.remove();
    },
    100,
    [loadQueue.size]
  );

  return (
    <FontFaceContext.Provider
      value={{
        loaded: list,
        load: loadFont,
      }}
    >
      {children}
    </FontFaceContext.Provider>
  );
};

export const useFontFace = () => {
  const fontFace = React.useContext(FontFaceContext);
  return fontFace;
};
