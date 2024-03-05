import React from "react";
import { useGuestbookContext } from "../Guestbook/context";
import { FormikHandlers, FormikState, FormikValues, useFormik } from "formik";
import { feathers } from "@/components/client/feathers";
import { MessageSchema } from "@/components/interfaces";

type GuestBookFormContextValue = FormikHandlers &
  FormikState<Pick<MessageSchema, "title" | "message">> & {};

const GuestBookFormContext = React.createContext<GuestBookFormContextValue>(
  {} as any
);
export const GuestBookFormContextProvider: React.FC<{
  children: (value: GuestBookFormContextValue) => React.ReactNode;
}> = ({ children }) => {
  const { token, refetch } = useGuestbookContext();
  const formik = useFormik({
    initialValues: {
      title: "",
      message: "",
      token,
    },
    onSubmit: async function (values, { setSubmitting }) {
      setSubmitting(true);
      if (!values["message"]) return;
      try {
        await feathers.service("messages").create(values);
        refetch();
      } catch (err: any) {
        console.error(err);
      }
      setSubmitting(false);
    },
  });
  return (
    <GuestBookFormContext.Provider value={formik}>
      {children(formik)}
    </GuestBookFormContext.Provider>
  );
};

export const useGuestbookFormContext = () => {
  return React.useContext(GuestBookFormContext);
};
