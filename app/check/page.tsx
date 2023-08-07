import Image from "next/image";
import styles from "./page.module.css";
import { CONSTANTS } from "@/components/Constants";

export default function Home() {
  return (
    <main>
      <div>Editor is up</div>
      <div>Server URL: {CONSTANTS.SERVER_URL}</div>
    </main>
  );
}
