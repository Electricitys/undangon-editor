import { CONSTANTS } from "@/components/Constants";

export default function Home() {
  return (
    <main>
      <div>Editor is up</div>
      <div>Server URL: {CONSTANTS.SERVER_URL}</div>
    </main>
  );
}
