import axios from "axios";
import { drop } from "lodash";
import { FeathersFindResult } from "../interfaces";

export const dropAxiosInstance = axios.create({
  baseURL: "/api/drop/v1",
  headers: {
    "X-App-Client": "web-browser",
  },
});

export interface FileSchema {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

interface ServerResponse<T = any> {
  error: boolean;
  message: string;
  data: T;
}

interface RequestFilterOperator {
  $in: any[];
  $nin: any[];
  $lt: any;
  $lte: any;
  $gt: any;
  $gte: any;
  $ne: any;
}

interface RequestFilter {
  $limit: number;
  $skip: number;
  $select: string[];
  $sort: {
    [fieldName: string]: 1 | -1;
  };
  [fieldName: string]: any | RequestFilterOperator;
}

export const drop_client = (() => {
  const cdnUrl = "/api/drop/cdn/files";
  const self = {
    async find(params?: Partial<RequestFilter>) {
      const response = await dropAxiosInstance.request({
        method: "GET",
        url: "/files",
        params,
      });

      const result = (
        response.data as ServerResponse<FeathersFindResult<FileSchema>>
      ).data;

      result.data = result.data.map((file) => ({
        ...file,
        url: `${cdnUrl}/${file.url}`,
      }));
      return result;
    },
    async get(id: string) {
      const result = await dropAxiosInstance.request({
        method: "GET",
        url: `/files/${id}`,
      });
      const file = (result.data as ServerResponse<FileSchema>).data;
      return {
        ...file,
        url: `${cdnUrl}/${file.url}`,
      };
    },
  };
  return self;
})();
