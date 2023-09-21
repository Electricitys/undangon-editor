import { feathers } from "@feathersjs/feathers";
import rest from "@feathersjs/rest-client";
import { CONSTANTS } from "../Constants";
import axios from "axios";

export const host = new URL(CONSTANTS.SERVER_URL);

export const featherRestApp = feathers();

// Connect to a different URL
const restClient = rest(host.origin);

// Configure an AJAX library (see below) with that client
featherRestApp.configure(restClient.axios(axios));
