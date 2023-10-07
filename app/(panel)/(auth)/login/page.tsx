"use client";

import { AuthPage } from "@refinedev/mantine";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  return (
    <AuthPage
      type="login"
      formProps={{
        initialValues: {
          email: "",
          password: "",
          callbackUrl:
            searchParams.get("callbackUrl") || searchParams.get("to"),
        },
      }}
    />
  );
}
