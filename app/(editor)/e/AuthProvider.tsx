"use client";

import { useClient } from "@/components/client";
import { useDisclosure } from "@mantine/hooks";
import { IconFidgetSpinner } from "@tabler/icons-react";
import { useRouter, usePathname } from "next/navigation";
import React from "react";

export const AuthProvider: React.FC<React.PropsWithChildren & {}> = ({
  children,
}) => {
  const client = useClient();
  const pathname = usePathname();
  const router = useRouter();

  const [isFetching, { close: fetchComplete }] = useDisclosure(true);

  React.useEffect(() => {
    console.log("AUTHENTICATION");
    async function fetch() {
      try {
        await client.reAuthenticate();
        fetchComplete();
      } catch (err) {
        router.replace(`/login?to=${pathname}`);
      }
    }
    fetch();
  }, []);

  if (isFetching) {
    return (
      <>
        {children}
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-300 bg-opacity-25">
          <IconFidgetSpinner
            size={150}
            className="animate-spin text-slate-500"
          />
        </div>
      </>
    );
  }

  return children;
};
