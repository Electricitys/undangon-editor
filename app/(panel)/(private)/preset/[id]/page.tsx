"use client";

import { PresetSchema } from "@/components/interfaces";
import { Text, Title } from "@mantine/core";
import { useShow } from "@refinedev/core";
import { Show } from "@refinedev/mantine";

const PresetShow: React.FC = () => {
  const { queryResult } = useShow<PresetSchema>();

  const { data } = queryResult;

  const record = data?.data;

  return (
    <Show>
      <Title order={4}>Name</Title>
      <Text>{record?.label}</Text>
      <Title order={4}>Category</Title>
      <Text>{record?.type.label}</Text>
      <Title order={4}>Owner</Title>
      <Text>{record?.user.name}</Text>
    </Show>
  );
};

export default PresetShow;
