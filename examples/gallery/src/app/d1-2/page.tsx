"use client";

import {
  MeridianWrapper,
  MeridianOverview,
  useODI,
} from "meridian-ui";
import menuData from "@/views/menu/menu.data.json";
import { useRouter } from "next/navigation";
import { menuConfig } from "@/views/menu/menu.config";
import { menuODI } from "@/views/menu/menu.meridian";
export default function R1() {
  const router = useRouter();

  const { odi, setODI } = useODI();

  return (
    <div>
      <button
        className="w-[20px] h-[20px] hover:bg-zinc-300 bg-white"
        onClick={() => {
          if (odi) {
            setTimeout(() => {
              setODI({
                ...odi,
                overviews: [
                  {
                    ...odi.overviews[0],
                    hiddenAttributes: [],
                  },
                ],
              });
            }, 15000);
          }
        }}
      ></button>
      <MeridianWrapper data={menuData} odi={menuODI} {...menuConfig}>
        <MeridianOverview />
      </MeridianWrapper>
    </div>
  );
}
