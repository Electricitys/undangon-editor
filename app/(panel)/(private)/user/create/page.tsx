"use client";
import { UserSchema } from "@/components/interfaces";
import { USER_ROLES } from "@/components/interfaces/constants";
import { PasswordInput, Select, TextInput } from "@mantine/core";
import { yupResolver } from "@mantine/form";
import { HttpError } from "@refinedev/core";
import { Create, useForm } from "@refinedev/mantine";
import * as Yup from "yup";

const schema = Yup.object().shape({
  name: Yup.string().min(2, "Name must have at least 3 letters"),
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password"), null as any], "Passwords must match")
    .required(),
  role: Yup.string().oneOf(Object.values(USER_ROLES)),
});

const UserCreate: React.FC = () => {
  const {
    getInputProps,
    saveButtonProps,
    refineCore: { formLoading },
  } = useForm<UserSchema, HttpError>({
    initialValues: {
      name: "",
      email: undefined,
      password: undefined,
      confirm_password: undefined,
      role: USER_ROLES.PUBLIC,
    },
    validate: yupResolver(schema),
    transformValues: (value) => ({
      ...value,
      confirm_password: undefined,
    }),
  });

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <form autoComplete="off">
        <TextInput mt="sm" label="Name" {...getInputProps("name")} />
        <TextInput mt="sm" label="Email" {...getInputProps("email")} />
        <Select
          mt="sm"
          label="Role"
          data={Object.values(USER_ROLES)}
          {...getInputProps("role")}
        />
        <PasswordInput
          mt="sm"
          label="Password"
          type="password"
          {...getInputProps("password")}
        />
        <PasswordInput
          mt="sm"
          label="Confirm Password"
          type="password"
          {...getInputProps("confirm_password")}
        />
      </form>
    </Create>
  );
};

export default UserCreate;
