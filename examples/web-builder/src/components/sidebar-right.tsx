import { useODI } from "meridian-ui";
import { AttributeStyleView } from "./style-view/attribute-style-view";
export const SidebarRight = () => {
  const { selectedItemEntity, getSelectedAttributeSet } = useODI();

  return (
    <div className="min-w-[300px] w-[300px] h-full flex flex-col gap-2 p-2 bg-white shadow-2xl overflow-scroll z-10">
      <AttributeStyleView />
    </div>
  );
};
