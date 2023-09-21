"use client";

import { UserSchema } from "@/components/interfaces";
import { Text, Title } from "@mantine/core";
import { useShow } from "@refinedev/core";
import { Show } from "@refinedev/mantine";

const UserShow: React.FC = () => {
  const { queryResult } = useShow<UserSchema>();

  const { data } = queryResult;

  const record = data?.data;

  return (
    <Show>
      <Title order={4}>Name</Title>
      <Text>{record?.name}</Text>
      <Title order={4}>Email</Title>
      <Text>{record?.email}</Text>
    </Show>
  );
};


export default UserShow;
