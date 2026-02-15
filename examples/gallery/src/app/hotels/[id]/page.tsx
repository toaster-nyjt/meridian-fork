"use client";

import { useParams } from "next/navigation";
import { MeridianDetail } from "meridian-ui";
import { MeridianWrapper } from "meridian-ui";
import { hotelsODI } from "@/views/hotels/hotels.meridian";
import { hotelsConfig } from "@/views/hotels/hotels.config";
import hotels from "@/views/hotels/hotels.data.json";

export default function R1Detail() {
  const params = useParams();
  const itemId = params.id as string;

  return (
    <div>
      <MeridianWrapper data={[hotels]} odi={hotelsODI} {...hotelsConfig}>
        <MeridianDetail itemId={itemId} />
      </MeridianWrapper>
    </div>
  );
}
