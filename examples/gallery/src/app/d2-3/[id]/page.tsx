"use client";

import { MeridianWrapper } from "@meridian-ui/meridian";
import {
  MeridianDetail,
} from "@meridian-ui/meridian";
import { r3Config } from "@/views/d2-3/r3-config";
import r3Data from "@/views/d2-3/r3-data.json";
import { r3ODI } from "@/views/d2-3/thesaurus.meridian";
import { useParams, useRouter } from "next/navigation";

export default function R3Detail() {
  const params = useParams();
  const router = useRouter();
  const itemId = (params.id as string) || "sophistication";

  console.log("itemId", itemId);

  if (!r3Data.find((item) => item?.term === itemId)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3">
        <h1 className="text-xl font-bold">
          We don't have "{itemId}" in our demo data.
        </h1>
        <p className="text-gray-500">Please try another word.</p>
        <button
          className="bg-gray-200 hover:bg-gray-300 active:bg-gray-400 transition-colors px-3 py-1 rounded-md cursor-pointer"
          onClick={() => router.back()}
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div>
      <MeridianWrapper
        data={r3Data}
        odi={r3ODI}
        {...r3Config}
        onOpenOverviewNewPage={() => {
          // router.back();
        }}
      >
        <MeridianDetail itemId={itemId} detailId={"word"} />
      </MeridianWrapper>
    </div>
  );
}
