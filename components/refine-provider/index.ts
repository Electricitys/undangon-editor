import { DataProvider } from "@refinedev/core";
import {
  generateSort,
  // generateFilter
} from "./utils";
import { host } from "../client/restClient";
import { feathers } from "../client/feathers";

// type MethodTypes = "get" | "delete" | "head" | "options";
// type MethodTypesWithBody = "post" | "put" | "patch";

export const dataProvider = (): Omit<
  Required<DataProvider>,
  "createMany" | "updateMany" | "deleteMany"
> => ({
  getList: async ({ resource, pagination, sorters, meta }) => {
    const service = feathers.service(resource);

    const { current = 1, pageSize = 10, mode = "server" } = pagination ?? {};

    const { headers: headersFromMeta } = meta ?? {};

    // const queryFilters = generateFilter(filters);

    const query: {
      $skip?: number;
      $limit?: number;
      $sort?: { [key: string]: number };
    } = {};

    if (mode === "server") {
      query.$skip = (current - 1) * pageSize;
      query.$limit = current * pageSize;
    }

    const generatedSort = generateSort(sorters);
    if (generatedSort) {
      query.$sort = generatedSort;
    }

    const { data, total } = await service.find({
      query,
      headers: headersFromMeta,
    });

    return {
      data,
      total,
    };
  },

  getMany: async ({ resource, meta }) => {
    const service = feathers.service(resource);

    const { headers, query } = meta ?? {};

    const { data } = await service.find({ headers, query });

    return {
      data,
    };
  },

  create: async ({ resource, variables, meta }) => {
    const service = feathers.service(resource);

    const { headers } = meta ?? {};

    let data = await service.create(variables as any, {
      headers,
    });

    return {
      data,
    };
  },

  update: async ({ resource, id, variables, meta }) => {
    const service = feathers.service(resource);

    const { headers } = meta ?? {};

    const data = await service.patch(id, variables as any, {
      headers,
    });

    return {
      data,
    };
  },

  getOne: async ({ resource, id, meta }) => {
    const service = feathers.service(resource);

    const { headers } = meta ?? {};

    const data = await service.get(id, { headers });

    return {
      data,
    };
  },

  deleteOne: async ({ resource, id, variables, meta }) => {
    const service = feathers.service(resource);

    const { headers } = meta ?? {};

    const data = await service.remove(id, {
      headers,
    });

    return {
      data,
    };
  },

  getApiUrl: () => {
    return host.origin;
  },

  custom: async ({
    url,
    method,
    filters,
    sorters,
    payload,
    query,
    headers,
  }) => {
    const data: any = { ini: "data custom" };

    return Promise.resolve({ data });
  },
});
