import { CONSTANTS } from "@/components/Constants";
import { LocateIcon } from "lucide-react";

export default function Home() {
  return (
    <main>
      <header>
        <div className="px-3 mx-auto h-44 max-w-[1280px] items-center justify-center">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Logo Manjo" height={36} src="/logo.svg" />
          </div>
        </div>
      </header>
      <div>Editor is up</div>
      <div>Server URL: {CONSTANTS.SERVER_URL}</div>
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
