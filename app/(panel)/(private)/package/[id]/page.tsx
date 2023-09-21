"use client";

import { PackageSchema } from "@/components/interfaces";
import { Text, Title } from "@mantine/core";
import { useShow } from "@refinedev/core";
import { Show } from "@refinedev/mantine";

export const PackageShow: React.FC = () => {
  const { queryResult } = useShow<PackageSchema>();

  const { data } = queryResult;

  const record = data?.data;

  return (
    <Show>
      <Title order={4}>Name</Title>
      <Text>{record?.name}</Text>
      <Title order={4}>Description</Title>
      <Text>{record?.description}</Text>
      <Title order={4}>Price</Title>
      <Text>{record?.price}</Text>
    </Show>
  );
};

export default PackageShow;
