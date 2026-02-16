"use client";

import { r1ODI } from "@/views/d2-1/att.meridian";
import { MeridianWrapper } from "meridian-ui";
import { MeridianOverview } from "meridian-ui";
import ATTItems from "@/views/d2-1/r1-data.json";
import { meridianConfig } from "@/views/d2-1/r1-config";


type MeridianWrapperProps = React.ComponentProps<typeof MeridianWrapper>;

export default function R1() {
  return (
    <div>
      <MeridianWrapper
        data={ATTItems}
        odi={r1ODI}
        {...(meridianConfig as Omit<MeridianWrapperProps, "children">)}
      >
        <MeridianOverview />
      </MeridianWrapper>
    </div>
  );
}
