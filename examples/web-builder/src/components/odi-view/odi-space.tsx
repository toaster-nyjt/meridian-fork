import { MeridianOverview, useODI } from "meridian-ui";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { useDragStore } from "@/store/drag.store";
import { debounce } from "@/helpers/interaction.helper";
export const ODISpace = () => {
  const { odi } = useODI();
  const { setRoleToDropOn } = useDragStore();
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [scale, setScale] = useState(1);
  const [positionX, setPositionX] = useState(window.innerWidth / 2 - 600);
  const [positionY, setPositionY] = useState(140);

  const minScale = 0.1;
  const maxScale = 4;

  // Add ref to store TransformWrapper instance
  const transformRef = useRef(null);

  // Debounced version of setRoleToDropOn
  const debouncedSetRoleToDropOn = useCallback(
    debounce((role: string | null) => {
      setRoleToDropOn(role);
    }, 50),
    [setRoleToDropOn]
  );

  // Root level drag handler
  const handleContainerDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      debouncedSetRoleToDropOn(null);
    },
    [debouncedSetRoleToDropOn]
  );
  // Handle manual panning with wheel
  const handleWheel = (ref: ReactZoomPanPinchRef, event: WheelEvent) => {
    // const handleWheel: WheelEventHandler = (event) => {

    event.preventDefault();
    const { deltaY } = event;
    const panSpeed = 0.8;
    const zoomSpeed = 0.001;
    // Zoom when Meta (Command) is pressed
    if (event.metaKey) {
      if (deltaY < 0) {
        ref.setTransform(
          ref.state.positionX,
          ref.state.positionY,
          Math.min(ref.state.scale + zoomSpeed, maxScale),
          0 // No animation
        );
      } else {
        ref.setTransform(
          ref.state.positionX,
          ref.state.positionY,
          Math.max(ref.state.scale - zoomSpeed, minScale),
          0 // No animation
        );
      }
    }
    // Horizontal pan when Control is pressed
    else if (event.ctrlKey) {
      ref.setTransform(
        positionX - deltaY * panSpeed, // Use deltaY for horizontal movement
        positionY,
        scale,
        0 // No animation
      );
    }
    // Vertical pan by default
    else {
      ref.setTransform(
        positionX,
        positionY - deltaY * panSpeed,
        scale,
        0 // No animation
      );
    }
    setScale(ref.state.scale);
    setPositionX(ref.state.positionX);
    setPositionY(ref.state.positionY);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsSpacePressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div
      className="w-full h-full flex flex-1"
      onDragEnter={handleContainerDragEnter}
    >
      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={minScale}
        maxScale={maxScale}
        limitToBounds={false}
        initialPositionX={positionX}
        initialPositionY={positionY}
        // alignmentAnimation={{
        //   disabled: true,
        //   sizeX: 1,
        //   sizeY: 0,
        // }}
        // wheel={
        //   {
        //     // step: 0.1,
        //     // wheelDisabled: true, // Disable default wheel behavior
        //     // touchPadDisabled: true,
        //     // activationKeys: ['Control', 'Meta', 'Shift'],
        //   }
        // }
        panning={{
          disabled: !isSpacePressed,
          velocityDisabled: true,
          lockAxisY: false,
          lockAxisX: false,
        }}
        onPanning={(r, e) => {
          setPositionX(r.state.positionX);
          setPositionY(r.state.positionY);
        }}
        onWheel={handleWheel}
      >
        {({ zoomIn, zoomOut, setTransform }) => (
          <TransformComponent
            wrapperClass="flex flex-1 bg-white shadow-lg h-full overflow-hidden"
            contentClass="h-full w-full"
            wrapperStyle={{
              cursor: isSpacePressed ? "grab" : "default",
              height: "100%",
            }}
          >
            <div className="flex flex-row justify-start items-start">
              {odi?.overviews.map((overview) => (
                <div
                  key={overview.id}
                  className="relative m-8 h-fit"
                  style={{
                    pointerEvents: isSpacePressed ? "none" : "auto",
                  }}
                >
                  <div className="absolute top-[-28px] z-1 text-white font-semibold bg-[#316746] px-4 pt-1 rounded-t-lg">
                    Overview{" "}
                    {isNaN(parseInt(overview.id ?? "0"))
                      ? overview.id
                      : parseInt(overview.id ?? "0") + 1}
                  </div>
                  {/* h-[calc(100vh-120px)]  */}
                  <div className="relative min-w-[1200px] max-w-[1200px] w-full bg-white shadow-2xl rounded-tr-lg rounded-br-lg rounded-bl-lg border-4 border-[#316746] overflow-auto">
                    <MeridianOverview overviewIdToShow={overview.id} />
                  </div>
                </div>
              ))}
            </div>
          </TransformComponent>
        )}
      </TransformWrapper>
    </div>
  );
};
