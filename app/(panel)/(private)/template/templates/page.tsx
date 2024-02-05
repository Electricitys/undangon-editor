"use client";

import { useTable } from "@refinedev/react-table";
import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
} from "@refinedev/mantine";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Group, LoadingOverlay, Pagination } from "@mantine/core";
import { TemplateSchema } from "@/components/interfaces";
import { Table } from "@/components/component/Table";

const TemplateList: React.FC = () => {
  const columns = useMemo<ColumnDef<TemplateSchema>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "ID",
      },
      {
        id: "name",
        accessorKey: "name",
        header: "Name",
      },
      {
        id: "user_id",
        accessorKey: "user.name",
        header: "User",
      },
      {
        id: "category_id",
        accessorKey: "category.name",
        header: "Category",
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: "Created At",
        cell: function render({ getValue }) {
          return <DateField format="LLL" value={getValue<any>()} />;
        },
      },
      {
        id: "updated_at",
        accessorKey: "updated_at",
        header: "Updated At",
        cell: function render({ getValue }) {
          return <DateField format="LLL" value={getValue<any>()} />;
        },
      },
      {
        id: "actions",
        accessorKey: "id",
        header: "Actions",
        enableSorting: false,
        cell: function render({ getValue }) {
          return (
            <Group spacing="xs" noWrap>
              <ShowButton hideText recordItemId={getValue() as string} />
              <EditButton hideText recordItemId={getValue() as string} />
              <DeleteButton hideText recordItemId={getValue() as string} />
            </Group>
          );
        },
      },
    ],
    []
  );
  const {
    getHeaderGroups,
    getRowModel,
    refineCore: { tableQueryResult, setCurrent, pageCount, current },
  } = useTable({
    columns,
  });

  if (tableQueryResult?.isLoading) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <List>
      <Table getHeaderGroups={getHeaderGroups} getRowModel={getRowModel} />
      <br />
      <Pagination
        position="right"
        total={pageCount}
        page={current}
        onChange={setCurrent}
      />
    </List>
  );
};

export default TemplateList;
