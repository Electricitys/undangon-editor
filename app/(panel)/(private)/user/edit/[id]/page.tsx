"use client";

import { PasswordInput, Select, TextInput, Title } from "@mantine/core";
import { yupResolver } from "@mantine/form";
import { HttpError } from "@refinedev/core";
import { Edit, useForm } from "@refinedev/mantine";
import * as Yup from "yup";
import _isEmpty from "lodash/isEmpty";
import { UserSchema } from "@/components/interfaces";
import { USER_ROLES } from "@/components/interfaces/constants";

interface UserValue extends Pick<UserSchema, "name" | "email" | "role"> {
  password?: UserSchema["password"];
  confirm_password?: UserSchema["password"];
}

const schema = Yup.object().shape(
  {
    name: Yup.string().min(2, "Name must have at least 3 letters"),
    email: Yup.string().email().required(),
    password: Yup.string().when("password", ([password]) =>
      !_isEmpty(password) ? Yup.string().min(8).required() : Yup.string()
    ),
    confirm_password: Yup.string().when("password", ([password]) =>
      !_isEmpty(password)
        ? Yup.string()
            .oneOf([Yup.ref("password"), null as any], "Passwords must match")
            .required()
        : Yup.string()
    ),
    role: Yup.string().oneOf(Object.values(USER_ROLES)),
  },
  [["password", "password"]]
);

const UserEdit: React.FC = () => {
  const { getInputProps, saveButtonProps } = useForm<
    UserSchema,
    HttpError,
    UserValue
  >({
    initialValues: {
      name: "",
      email: "",
      role: "public",
      password: "",
      confirm_password: "",
    },
    validate: yupResolver(schema),
    transformValues: (value) => ({
      ...value,
      confirm_password: undefined,
    }),
  });

  return (
    <>
      <Edit saveButtonProps={saveButtonProps}>
        <TextInput
          mt="sm"
          label="Name"
          {...(getInputProps("name"), { type: "input" })}
        />
        <TextInput
          mt="sm"
          label="Email"
          {...(getInputProps("email"), { type: "input" })}
        />
        <Select
          mt="sm"
          label="Role"
          data={Object.values(USER_ROLES)}
          {...getInputProps("role", { type: "input" })}
        />
        <Title mt="lg" order={4}>
          Change Password
        </Title>
        <PasswordInput
          mt="sm"
          label="New Password"
          autoComplete="new-password"
          {...getInputProps("password", { type: "input" })}
        />
        <PasswordInput
          mt="sm"
          label="Confirm Password"
          autoComplete="new-password"
          {...getInputProps("confirm_password", { type: "input" })}
        />
      </Edit>
    </>
  );
};


export default UserEdit;
