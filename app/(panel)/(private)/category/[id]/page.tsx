"use client";

import { CategorySchema } from "@/components/interfaces";
import { Text, Title } from "@mantine/core";
import { useShow } from "@refinedev/core";
import { Show } from "@refinedev/mantine";

const CategoryShow: React.FC = () => {
  const { queryResult } = useShow<CategorySchema>();

  const { data } = queryResult;

  const record = data?.data;

  return (
    <Show>
      <Title order={4}>Name</Title>
      <Text>{record?.name}</Text>
    </Show>
  );
};

export default CategoryShow;
