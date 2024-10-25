import { QueryProvider } from "@/components/client/ReactQuery";
import "../globals.css";
// import { Inter } from "next/font/google";
import { ClientProvider } from "@/components/client";
import { redirect } from "next/navigation";
import { Metadata } from "next";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Undangon - Editor",
  description: "Create your dream invitation.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      style={{
        scrollBehavior: "smooth",
      }}
    >
      <body tabIndex={0}>
        <QueryProvider>
          <ClientProvider>{children}</ClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
