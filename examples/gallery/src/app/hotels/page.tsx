"use client";

import { MeridianWrapper } from "meridian-ui";
import { MeridianOverview } from "meridian-ui";
import hotelsData from "@/views/hotels/hotels.data.json";
import { useParams } from "next/navigation";
import { hotelsODI } from "@/views/hotels/hotels.meridian";
import { hotelsConfig } from "@/views/hotels/hotels.config";

export default function R3Detail() {
  const params = useParams();
  const itemId = params.id as string;

  return (
    <div className="m-4">
      <MeridianWrapper data={hotelsData} odi={hotelsODI} {...hotelsConfig}>
        <MeridianOverview />
      </MeridianWrapper>
    </div>
  );
}
