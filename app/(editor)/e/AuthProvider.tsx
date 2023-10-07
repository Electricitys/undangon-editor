"use client";

import { redirect, usePathname, useSearchParams } from "next/navigation";
import React from "react";

export const AuthProvider: React.FC<React.PropsWithChildren & {}> = ({
  children,
}) => {
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
