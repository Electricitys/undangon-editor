import { ActionIcon, Flex, Table as MantineTable, Text } from "@mantine/core";
import {
  IconArrowNarrowDown,
  IconArrowNarrowUp,
  IconArrowsVertical,
} from "@tabler/icons-react";
import { HeaderGroup, RowModel, flexRender } from "@tanstack/react-table";

export const Table: React.FC<{
  getHeaderGroups: () => HeaderGroup<any>[];
  getRowModel: () => RowModel<any>;
}> = ({ getHeaderGroups, getRowModel }) => {
  return (
    <MantineTable>
      <thead>
        {getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                <Flex
                  sx={{
                    cursor: header.column.getCanSort() ? "pointer" : undefined,
                    ".sort-action": {
                      opacity: 0,
                    },
                    ":hover .sort-action, .sort-action.active": {
                      opacity: 1,
                    },
                  }}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <Text sx={{ flexGrow: 1 }}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </Text>
                  {header.column.getCanSort() && (
                    <ActionIcon
                      className={`sort-action ${
                        header.column.getIsSorted() && "active"
                      }`}
                      size="xs"
                    >
                      {{
                        asc: <IconArrowNarrowDown />,
                        desc: <IconArrowNarrowUp />,
                      }[header.column.getIsSorted() as string] ?? (
                        <IconArrowsVertical />
                      )}
                    </ActionIcon>
                  )}
                </Flex>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </MantineTable>
  );
};
