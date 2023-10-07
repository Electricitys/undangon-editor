"use client";

import { feathers as Feathers } from "@feathersjs/feathers";
import FeathersAuth from "@feathersjs/authentication-client";
import rest from "@feathersjs/rest-client";
import axios from "axios";
import nookies from "nookies";
import { host } from "./restClient";

export const feathers = Feathers();
const restClient = rest(host.origin);

export const axiosInstance = axios.create({
  headers: {
    "X-App-Client": "web-browser",
  },
});

export const COOKIE_NAME = "undangon_client";

class ServerStorage {
  setItem(key: string, value: string): void {
    nookies.set(null, key, value, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
  getItem(key: string): string | null {
    const cookies = nookies.get(null);
    return cookies[key];
  }
  removeItem(key: string): void {
    nookies.destroy(null, key);
  }
}

const serverStorage = new ServerStorage();

feathers.configure(restClient.axios(axiosInstance));
feathers.configure(
  FeathersAuth({
    storage:
      typeof window === "undefined" ? serverStorage : window.localStorage,
    storageKey: "undangon_client",
  })
);
