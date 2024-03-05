import { feathers } from "@/components/client/feathers";
import { FeathersFindResult, MessageSchema } from "@/components/interfaces";
import { useQuery } from "@tanstack/react-query";
import React from "react";

type GuestBookContexProps = {
  token: string;
};
type GuestBookContextValue = GuestBookContexProps & {
  data: MessageSchema[];
  refetch: () => void;
};

const GuestBookContext = React.createContext<GuestBookContextValue>(
  null as any
);
export const GuestBookContextProvider: React.FC<
  React.PropsWithChildren<GuestBookContexProps>
> = ({ children, token }) => {
  const queryFn = useQuery(["guestbook"], async () => {
    const data = await feathers.service("messages").find({
      query: {
        token,
      },
    });
    console.log(data);
    return data as FeathersFindResult<MessageSchema>;
  });

  const { total, limit, skip, data } =
    (queryFn.data as FeathersFindResult<MessageSchema>) || {};

  return (
    <GuestBookContext.Provider
      value={{
        token,
        data: data || [],
        refetch: () => {
          queryFn.refetch();
        },
      }}
    >
      {children}
    </GuestBookContext.Provider>
  );
};

export const useGuestbookContext = () => {
  return React.useContext(GuestBookContext);
};
