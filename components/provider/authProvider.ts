import { AuthProvider } from "@refinedev/core";
import {
  AuthActionResponse,
  CheckResponse,
  IdentityResponse,
} from "@refinedev/core";
import { feathers } from "../client/feathers";

interface IAuthBindings extends Omit<AuthProvider, "getIdentity"> {
  getIdentity: (params?: any) => Promise<IdentityResponse>;
}

// It is a mock auth provider.
export const authProvider: IAuthBindings = (() => {
  return {
    // required methods
    login: async ({
      email,
      password,
      remember = false,
      callbackUrl,
    }: {
      email: string;
      password: string;
      callbackUrl: string;
      remember: boolean;
    }): Promise<AuthActionResponse> => {
      const result = await feathers.authenticate({
        strategy: "local",
        email,
        password,
      });

      if (result) {
        return {
          success: true,
          redirectTo: callbackUrl || "/",
        };
      }

      return {
        success: false,
        error: {
          message: "Invalid credentials",
          name: "Invalid credentials",
        },
      };
    },
    check: async (force: boolean = false): Promise<CheckResponse> => {
      try {
        await feathers.reAuthenticate(force);
        return {
          authenticated: true,
        };
      } catch (err) {
        return {
          authenticated: false,
          logout: true,
          redirectTo: "/login",
          error: {
            message: (err as any).message,
            name: "Unauthorized",
          },
        };
      }
    },
    logout: async ({ redirectPath }: any = {}): Promise<AuthActionResponse> => {
      await feathers.logout();
      return {
        success: true,
        redirectTo: redirectPath || "/",
      };
    },
    onError: async (error) => {
      if (error.status === 401 || error.status === 403) {
        return {
          logout: true,
          redirectTo: "/login",
          error,
        };
      }
      return {};
    },
    getIdentity: async () => {
      const user = await feathers.get("authentication");
      if (user) return user;
      return null;
    },
  };
})();
