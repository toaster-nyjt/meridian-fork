"use client";

import { Navbar } from "../components/navbar";
import { customItemViews, customOverviews } from "@/meridian-views/views.index";
import { ODI } from "meridian-ui";         
import { SidebarLeft } from "../components/sidebar-left"; 
import { useDataUploadStore } from "@/store/data-upload.store";
import { limitData } from "@/helpers/data.helper";
import { SidebarRight } from "../components/sidebar-right";
import { MeridianWrapper } from "meridian-ui";
import { ODISpace } from "../components/odi-view/odi-space";
export default function Home() {
  const { data } = useDataUploadStore();

  const initialODI: ODI = {
    dataBinding: [
      {
        binding: {
          itemId: "skeleton",
          attributes: [
            // {
            //   value: '.Name',
            //   type: 'string',
            //   roles: ['title'],
            // },
          ],
        },
      },
    ],
    overviews: [
      {
        id: "0",
        type: "list",
      },
    ],
  };

  return (
    <MeridianWrapper
      data={limitData(data)}
      odi={initialODI}
      customOverviewTypes={customOverviews}
      customItemViewTypes={customItemViews}
      onOpenDetailNewPage={() => {}}
      onOpenOverviewNewPage={() => {}}
    >
      <div className="h-screen flex flex-col">
        <div className="flex-1 flex flex-row justify-evenly overflow-auto">
          <div className="absolute top-0 left-0 w-screen h-screen flex flex-col justify-between z-10 pointer-events-none">
            <div className="h-full w-full flex flex-col justify-between">
              <div className="pointer-events-auto">
                <Navbar />
              </div>
              <div className="h-full w-full flex flex-row justify-between">
                <div className="pointer-events-auto">
                  <SidebarLeft />
                </div>
                <div className="pointer-events-auto">
                  <SidebarRight />
                </div>
              </div>
            </div>
          </div>

          <ODISpace />
        </div>
      </div>
    </MeridianWrapper>
  );
}
