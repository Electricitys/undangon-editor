import { get as _get } from "lodash";
import { AuthPage } from "@/components/page/AuthPage";

type LoginPageProps = {
  params?: Record<string, string>;
  searchParams?: Record<string, string>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <AuthPage
      type="login"
      formProps={{
        initialValues: {
          email: "",
          password: "",
          callbackUrl:
            _get(searchParams, "callbackUrl") || _get(searchParams, "to"),
        },
      }}
    />
  );
}
