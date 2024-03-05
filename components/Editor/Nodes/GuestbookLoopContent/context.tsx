import React from "react";

type GuestBookItemContextValue = {
  title: string;
  message: string;
  date: string;
};

const GuestBookItemContext = React.createContext<GuestBookItemContextValue>(
  null as any
);
export const GuestBookItemContextProvider: React.FC<
  React.PropsWithChildren<GuestBookItemContextValue>
> = ({ children, ...rest }) => {
  return (
    <GuestBookItemContext.Provider value={rest}>
      {children}
    </GuestBookItemContext.Provider>
  );
};

export const useGuestbook = () => {
  return;
};
