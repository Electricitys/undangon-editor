"use client";

import { useClient } from "@/components/client";
import { useRouter, usePathname } from "next/navigation";
import React from "react";

export const AuthProvider: React.FC<React.PropsWithChildren & {}> = ({
  children,
}) => {
  const client = useClient();
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    async function fetch() {
      try {
        await client.reAuthenticate();
      } catch (err) {
        router.replace(`/login?to=${pathname}`);
      }
    }
    fetch();
  }, []);
  // const pathname = usePathname();
  // if (!session.user) {
  //   return redirect(`/login?callbackUrl=${pathname}`);
  // }
  // console.log(session);
  return children;
  // return (
  //   <>
  //     <SessionProvider>{children}</SessionProvider>
  //   </>
  // );
};
