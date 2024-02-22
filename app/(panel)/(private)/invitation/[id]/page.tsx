"use client";

import { APP_DOMAIN, CONSTANTS } from "@/components/Constants";
import { InvitationSchema } from "@/components/interfaces";
import { Button, Text, Title } from "@mantine/core";
import { Share1Icon } from "@radix-ui/react-icons";
import { useShow } from "@refinedev/core";
import { Show } from "@refinedev/mantine";
import Link from "next/link";

const InvitationShow: React.FC = () => {
  const { queryResult } = useShow<InvitationSchema>();

  const { data } = queryResult;

  const record = data?.data;

  const shareUrl = `/invitation/${data?.data.id}/${data?.data.slug}/share`;

  return (
    <Show
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <Button
            component={Link}
            href={shareUrl}
            target="_blank"
            leftIcon={<Share1Icon />}
          >
            Share
          </Button>
        </>
      )}
    >
      <Title order={4}>Name</Title>
      <Text>{record?.name}</Text>
      <Title order={4}>Category</Title>
      <Text>{record?.category.name}</Text>
      <Title order={4}>Owner</Title>
      <Text>{record?.user.name}</Text>
    </Show>
  );
};

export default InvitationShow;
