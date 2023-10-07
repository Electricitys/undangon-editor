import { GetServerSideProps } from "next";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return children;
}
