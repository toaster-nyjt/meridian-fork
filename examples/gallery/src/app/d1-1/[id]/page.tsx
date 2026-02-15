"use client";

import { r1ODI } from "@/views/d2-1/att.meridian";
import { useParams } from "next/navigation";
import { MeridianDetail, MeridianWrapper } from "@meridian-ui/meridian";
import dataLists from "@/views/d2-1/r1-data.json";
import { meridianConfig } from "@/views/d2-1/r1-config";

export default function R1Detail() {
  const params = useParams();
  const itemId = params.id as string;

  return (
    <div>
      <MeridianWrapper data={[dataLists]} odi={r1ODI} {...meridianConfig}>
        {/* Pass the found item to MeridianDetail */}
        <MeridianDetail itemId={itemId} detailId="new-page-detail" />
      </MeridianWrapper>
    </div>
  );
}
