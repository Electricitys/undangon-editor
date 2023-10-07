"use client";

import {
  AuthenticationRequest,
  AuthenticationResult,
} from "@feathersjs/authentication";
import {
  Application,
  feathers as Feathers,
  FeathersService,
  Params,
  Query,
  Service,
} from "@feathersjs/feathers";
import nookies from "nookies";
import React from "react";
import { host } from "./restClient";
import { COOKIE_NAME, feathers } from "./feathers";
import { redirect } from "next/navigation";
import { UserSchema } from "../interfaces";

type Services =
  | "users"
  | "categories"
  | "invitations"
  | "packages"
  | "sharing_parties"
  | "sharing_party_email_address"
  | "templates";

interface ClientProps {
  host: URL;
  feathers: Application<any, any>;
  account: Account | null;
  role: string | null;

  authenticate: (
    data: AuthenticationRequest,
    params: Params<Query>
  ) => Promise<AuthenticationResult>;
  logout: () => Promise<AuthenticationResult | null>;
  reAuthenticate: (force?: boolean) => Promise<AuthenticationResult>;

  isAuthenticated(): boolean;
  isConnected(): boolean;
  __connected: boolean;
  __authenticated: boolean;

  get: (name: string) => any;
  service: <L extends Services>(
    path: L
  ) => FeathersService<
    Application<any, any>,
    Service<any, Partial<any>, Params<Query>, Partial<Partial<any>>>
  >;
}

export const ClientContext = React.createContext<ClientProps>(null as any);

interface ClientProviderProps {
  children: React.ReactNode;
}

interface Account extends UserSchema {}

export const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  const [account, setAccount] = React.useState<Account | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const role = React.useMemo<ClientProps["role"]>(() => {
    if (account === null) return null;
    return account.role;
  }, [account]);

  React.useEffect(() => {
    async function fetch() {
      if (typeof window === "undefined") return;
      await reAuthenticate(true);
    }
    fetch();
    // if(COOKIES[COOKIE_NAME]) {
    // }
    // const listener = [
    //   () => {
    //     setIsConnected(true);
    //   },
    //   () => {
    //     setIsConnected(false);
    //   },
    // ];
    // socket.on("connect", listener[0]);
    // socket.on("disconnect", listener[1]);
    // return () => {
    //   socket.off("connect", listener[0]);
    //   socket.off("disconnect", listener[1]);
    // };
  }, []);

  const authenticate: ClientProps["authenticate"] = async (data, params) => {
    try {
      const res = await feathers.authenticate(data, params);
      const account = res.user;
      setAccount(account);
      setIsAuthenticated(true);
      return res;
    } catch (err) {
      throw new Error(err as any);
    }
  };

  async function reAuthenticate(force = false) {
    try {
      const res = await feathers.reAuthenticate(force);
      const account = res.user;
      setAccount(account);
      setIsAuthenticated(true);
      return res;
    } catch (err) {
      setIsAuthenticated(false);
      throw new Error(err as any);
    }
  }

  async function logout() {
    const ret = await feathers.logout();
    await setIsAuthenticated(false);
    return ret;
  }

  const client = React.useMemo<ClientProps>(() => {
    return {
      host,
      feathers,
      account,
      role,

      authenticate,
      logout,
      reAuthenticate,

      isAuthenticated() {
        return isAuthenticated;
      },
      isConnected() {
        return isConnected;
      },
      __connected: isConnected,
      __authenticated: isAuthenticated,

      get: (name: string) => {
        return feathers.get(name);
      },

      service: (path) => feathers.service(path),
    };
  }, [isConnected, isAuthenticated, account, role]);

  return (
    <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
  );
};

export const useClient = () => {
  const client = React.useContext(ClientContext);
  return client;
};
