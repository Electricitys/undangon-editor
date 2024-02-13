"use client";

import { CONSTANTS } from "@/components/Constants";
import { Box, Button, Flex, Text, Title } from "@mantine/core";
import { LocateIcon } from "lucide-react";
import { HomepageCarousel } from "./HomeCarousel";

export default function Home() {
  return (
    <main>
      <header>
        <Flex
          justify={"center"}
          align={"center"}
          px="md"
          maw={1280}
          mx="auto"
          h={168}
        >
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Logo Manjo" height={36} src="/logo.svg" />
          </div>
        </Flex>
      </header>

      <main
        style={{
          textAlign: "center",
        }}
      >
        <section>
          <Title order={3}>Pakai Undangan Digital</Title>
          <Text mb="xl">Tanpa Kertas. Tanpa Ribet.</Text>
          <Button
            component="a"
            rel="noreferrer"
            target="_blank"
            href="https://api.whatsapp.com/send?phone=6282187788484&text=Hallo%2C%0ASaya%20ingin%20membuat%20undangan%20online"
            variant="filled"
            color="dark"
            size="lg"
            px={"xs"}
          >
            Pesan Sekarang
          </Button>
        </section>
        <Box component="section" mt={"lg"} pb={"md"}>
          <Box>
            {/* <HomepageCarousel /> */}
          </Box>
        </Box>
      </main>

      <footer>
        <div className="py-4 px-3 mx-auto max-w-[750px]">
          <div className="flex-col items-center opacity-75">
            <div className="items-center pb-2">
              <LocateIcon />
              <div className="ml-2">Dengan cinta, dari Manado</div>
            </div>
            <div className="grow-1" />
            <div>&#169; Manjo 2020.</div>
          </div>
        </div>
      </footer>
    </main>
  );
}
