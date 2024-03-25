import { CrudSorting } from "@refinedev/core";

export const generateSort = (sorters?: CrudSorting) => {
  const sort: { [key: string]: number } = {};
  if (sorters && sorters.length > 0) {
    sorters.forEach((item) => {
      sort[item.field] = item.order === "asc" ? 1 : 0;
    });

    return sort;
  }

  return;
};
