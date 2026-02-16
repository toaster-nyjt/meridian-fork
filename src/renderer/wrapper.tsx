"use client";

import { useEffect } from "react";
import { skeletonODI } from "../assets/dummy-data/skeleton";
import { ODI } from "../spec/spec";
import { FetchedItemType } from "../spec/spec.internal";
import { useODI } from "../store/odi.store";
import { MeridianDetail } from "./renderer";
import {
  AttributeTypeConfig,
  CustomDetailViewType,
  CustomOverviewType,
  DetailViewTypeConfig,
  ItemViewTypeConfig,
  OverviewTypeConfig,
} from "./renderer.defaults";
import { SettingsPanel } from "../components/malleability/console/console-view";
import "./renderer.scss";
// import { MalleabilitySemZoom } from "@/examples/gallery/src/app/d2-3/[id]/malleability-semzoom";

export interface InitMeridianProps {
  data?: any;
  odi?: ODI;
  customOverviewTypes?: OverviewTypeConfig<CustomOverviewType>[];
  customItemViewTypes?: ItemViewTypeConfig[];
  customDetailViewTypes?: DetailViewTypeConfig<CustomDetailViewType>[];
  customAttributeTypes?: AttributeTypeConfig[];
  onOpenDetailNewPage: (item: FetchedItemType) => void; // Routing function
  onOpenOverviewNewPage: () => void; // Routing function
  onAction?: React.MouseEventHandler<HTMLButtonElement>;
  overviewIdToShow?: string;
  isNewPage?: boolean;
}

export const MeridianWrapper = ({
  children,
  data: dataInitial,
  odi: odiInitial,
  customOverviewTypes,
  customItemViewTypes,
  customDetailViewTypes,
  customAttributeTypes,
  onOpenDetailNewPage,
  onOpenOverviewNewPage,
  onAction,
  isNewPage,
}: {
  children: React.ReactNode;
} & InitMeridianProps) => {
  const {
    selectedItemEntity,
    clearSelectedItemEntity,
    odi,
    selectedAttributes,
    getSelectedAttributeSet,
    lastSelected,
    clearSelection,
    setSpecShownAttributes,
    highlightAttributes,
    setHighlightAttributes,
    closeDetail,
    malleabilityConsoleOpen,
    setMalleabilityConsoleOpen,
    initialize,
  } = useODI();
  // console.log("wrapper: odi", odi);
  // console.log("wrapper: odiInitial", odiInitial);
  // console.log("wrapper: selectedItemEntity", selectedItemEntity);

  // Initialize Meridian with all data and configuration
  useEffect(() => {
    console.log("====: initialize");
    initialize(
      dataInitial,
      odiInitial ?? skeletonODI,
      {
        customOverviewTypes,
        customItemViewTypes,
        customDetailViewTypes,
        customAttributeTypes,
      },
      {
        onOpenDetailNewPage,
        onOpenOverviewNewPage,
      }
    );
  }, [dataInitial, odiInitial, customOverviewTypes, customItemViewTypes, customDetailViewTypes, customAttributeTypes, onOpenDetailNewPage, onOpenOverviewNewPage, initialize]);

  // Add a class name that combines the base class with a conditional popup-active class
  const wrapperClassName = `odi-wrapper relative ${selectedItemEntity?.detail.openIn === "pop-up" ? "popup-active" : ""
    }`;

  if (!odi) return <></>;
  return (
    <div className="odi-wrapper-container">
      {
        // ---- MALLEABILITY SEMZOOM ----
        // <MalleabilitySemZoom />
      }
      {
        // ---- MALLEABILITY CONSOLE ----
        malleabilityConsoleOpen && (
          <div className="malleability-console">
            <div
              className="console-overlay"
              onClick={() => setMalleabilityConsoleOpen(false)}
            />
            <SettingsPanel />
          </div>
        )
      }
      <div className={wrapperClassName}>
        {
          // ---- POPUP VIEW ----
          odi && selectedItemEntity?.detail.openIn === "pop-up" && (
            <div className="pop-up">
              {/* Dark overlay */}
              <div className="overlay" onClick={clearSelectedItemEntity} />
              {/* Detail View */}
              <div className="detail-view-wrapper">
                <MeridianDetail odi={odi} itemId={selectedItemEntity?.itemId} />
              </div>
            </div>
          )
        }
        {
          // ---- TOOLTIP VIEW ----
          // odi && selectedItemEntity?.detail.openIn === 'tooltip' && (
          //   <div className="fixed w-full h-full flex justify-center items-center z-40">
          //     {/* Dark overlay */}
          //     <div
          //       className="absolute w-full h-full z-0"
          //       onClick={clearSelectedItemEntity}
          //     />
          //     {/* Detail View */}
          //     <div
          //       className="fixed w-[400px] h-fit max-h-[500px] bg-white shadow-2xl h-[96%] rounded-md z-10 overflow-scroll"
          //       style={getBottomCenter(
          //         {
          //           x: selectedItemEntity.mousePosition.x,
          //           y: selectedItemEntity.mousePosition.y - 30,
          //         },
          //         { width: 400, height: 500 }
          //       )}
          //     >
          //       <MeridianDetail
          //         odi={odi}
          //         item={getSelectedAttributeSet()}
          //         onOpenDetailNewPage={onOpenDetailNewPage}
          //         onOpenOverviewNewPage={onOpenOverviewNewPage}
          //       />
          //     </div>
          //   </div>
          // )
        }
        {
          // ---- MALLEABILITY TOOLTIPS ----
          selectedAttributes.length > 0 && (
            <div
              className="malleability-tooltip"
              style={{
                left: lastSelected.position.x,
                top: lastSelected.position.y,
              }}
            >
              {lastSelected.view === "overview" && (
                <button
                  onClick={() => {
                    setSpecShownAttributes("hide");
                    // Reset selection
                    clearSelection();
                    setHighlightAttributes(false);
                  }}
                >
                  Hide Attributes
                </button>
              )}
              {lastSelected.view === "detail" && (
                <button
                  onClick={() => {
                    setSpecShownAttributes("show");
                    // Reset selection
                    clearSelection();
                    setHighlightAttributes(false);
                    // Navigate back to overview
                    closeDetail();
                  }}
                >
                  Show Attributes
                </button>
              )}
            </div>
          )
        }
        {/* {
        // ---- MALLEABILITY TOOLBAR ----
        (malleableCompositionSetting().includes('toolbar') || enabledMalleableLayout()) && (
          <MalleabilityToolbar />
        )
      } */}
        {children}
      </div>
    </div>
  );
};
