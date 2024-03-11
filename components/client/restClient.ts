import { feathers } from "@feathersjs/feathers";
import rest from "@feathersjs/rest-client";
import { CONSTANTS } from "../Constants";
import axios from "axios";

export const host = new URL(CONSTANTS.SERVER_URL);

const f = feathers()

// Connect to a different URL
const restClient = rest(host.origin);

// Configure an AJAX library (see below) with that client
f.configure(restClient.axios(axios));

console.log(CONSTANTS);

export const featherRestApp = f;

