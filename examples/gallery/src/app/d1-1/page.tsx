"use client";

import { r1ODI } from "@/views/d2-1/att.meridian";
import { MeridianWrapper, MeridianOverview } from "@meridian-ui/meridian";
import ATTItems from "@/views/d2-1/r1-data.json";
import { useRouter } from "next/navigation";
import { meridianConfig } from "@/views/d2-1/r1-config";

export default function R1() {
  const router = useRouter();

  return (
    <div>
      <MeridianWrapper data={ATTItems} odi={r1ODI} {...meridianConfig}>
        {/* <div className="bg-gray-100 w-fit rounded-lg p-2 text-sm m-2">
          To open the widget, hover over the tab bar below, then click "More
          Settings"
        </div> */}
        <MeridianOverview />
      </MeridianWrapper>
    </div>
  );
}
