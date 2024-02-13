import { Autocomplete, Box, Flex, Group, Loader } from "@mantine/core";
import { useList } from "@refinedev/core";
import { IconSearch } from "@tabler/icons-react";
import React from "react";
import { StudentSchema } from "../../../provider/schema/student.schema";
import { useDebouncedValue } from "@mantine/hooks";

export const SearchField: React.FC<{
  resource: string;
  filters: string[];

  placeholder?: string;
}> = ({ resource, filters, placeholder = "Search something" }) => {
  const [value, setValue] = React.useState<string>("");
  const [filterValue] = useDebouncedValue(value, 500);
  const { data, isLoading, isError } = useList<StudentSchema>({
    resource,
    filters: filterValue
      ? [
          {
            operator: "or",
            value: filters.map((filter) => {
              return {
                field: filter,
                operator: "contains",
                value: `%${filterValue}%`,
              };
            }),
          },
        ]
      : [],
  });

  const options = React.useMemo(() => {
    return (
      data?.data.map((d) => ({
        value: `${d.last_name}, ${d.first_name} ${d.middle_name}`,
        label: d.student_id,
        data: d,
      })) || []
    );
  }, [data]);

  return (
    <Autocomplete
      w="100%"
      icon={isLoading ? <Loader size={16} /> : <IconSearch size={16} />}
      withinPortal
      placeholder={placeholder}
      itemComponent={React.forwardRef(({ label, data, ...others }, ref) => (
        <div {...others}>
          <Flex mx="sm">
            <Box mr="sm">{data.student_id}</Box>
            <Box>
              {data.last_name}, {data.first_name} {data.middle_name}
            </Box>
          </Flex>
        </div>
      ))}
      data={options}
      // onChange={setValue}
      // value={value}
    />
  );
};
