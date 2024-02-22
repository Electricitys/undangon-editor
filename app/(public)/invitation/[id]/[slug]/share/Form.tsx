"use client";

import { APP_DOMAIN } from "@/components/Constants";
import { transformMessage } from "@/components/Editor/utils/transformMessage";
import { transformMessagePreview } from "@/components/Editor/utils/transformMessagePreview";
import { featherRestApp } from "@/components/client/restClient";
import { InvitationSchema } from "@/components/interfaces";
import { Divider, Flex } from "@mantine/core";
import { Box, Button, TextInput, Textarea } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useFormik } from "formik";
import React from "react";

const default_share_message = `Demikianlah mereka bukan lagi dua, melainkan satu. Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia. (Matius 19:6)\n\nTanpa mengurangi rasa hormat, perkenankan kami menginformasikan kepada Bapak/Ibu/Saudara/i, teman sekaligus sahabat acara pernikahan kami:\n\n*Nama Mempelai & Nama Mempelai*\n\nMerupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i untuk memberikan doa restu kepada kami.\nJangan lupa isi Guestbook ya..\n\nTerima Kasih..\n\nWith pray & love,\n*Nama Panggilan & Nama Panggilan*\n#Manjo`;

export default function ShareForm({
  id,
  slug,
  metadata,
  share_message = default_share_message,
}: Pick<InvitationSchema, "id" | "slug" | "metadata" | "share_message">) {
  const invitationUrl = React.useMemo(() => {
    return `https://${APP_DOMAIN}/i/${slug}`;
  }, [APP_DOMAIN, slug]);

  let temp_share_message = React.useRef(
    typeof share_message === "string" ? share_message : default_share_message
  );

  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      to: "",
      message: share_message || default_share_message,
    },

    async onSubmit(values, { setSubmitting }) {
      setSubmitting(true);
      const url = `${invitationUrl}?to=${encodeURIComponent(values["to"])}`;
      const { text } = transformMessage(values["message"], {
        to: values["to"],
        url,
      });

      try {
        if (values["message"] != temp_share_message.current) {
          await featherRestApp.service("invitations").patch(id, {
            share_message: values["message"],
          });
          temp_share_message.current = values["message"];
          showNotification({
            title: "Success",
            message: "Message is saved",
          });
        }
      } catch (err) {
        showNotification({
          title: "Error",
          message: "While saving the message",
        });
        console.error(err);
      }

      try {
        await navigator.share({
          url: url,
          title: `${metadata.title}`,
          text: text,
        });
      } catch (err) {
        console.error(err);
      }

      setSubmitting(false);
    },
  });

  const transformedMessage = transformMessage(values["message"], {
    to: values["to"],
    url: `${invitationUrl}?to=${encodeURIComponent(values["to"])}`,
  });

  return (
    <Flex
      pt="lg"
      mih={"100vh"}
      maw={350}
      mx="auto"
      justify={"center"}
      direction={"column"}
    >
      <form onSubmit={handleSubmit}>
        <TextInput
          mb="md"
          name="to"
          label="To"
          value={values["to"]}
          placeholder="Who?"
          onChange={handleChange}
        />
        <Textarea
          label="Message"
          name="message"
          autosize={true}
          value={values["message"]}
          placeholder={`Dear ${
            values["to"] ? values["to"] : "Who?"
          }, bla bla bla`}
          onChange={handleChange}
          minRows={3}
          mb="md"
        />
        <Button type="submit">Share</Button>
      </form>

      <Divider my="lg" />

      <Box
        mb="lg"
        sx={{
          whiteSpace: "pre-line",
        }}
        dangerouslySetInnerHTML={{
          __html: transformMessagePreview(transformedMessage.text),
        }}
      />
      <Box
        component="footer"
        mt={50}
        mb={150}
        sx={{
          color: "#aaa",
          textAlign: "center",
        }}
      >
        <div>Made with ❤ by Manjo.</div>
      </Box>
    </Flex>
  );
}
