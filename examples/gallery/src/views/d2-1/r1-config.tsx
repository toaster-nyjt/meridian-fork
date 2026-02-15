import { AttributeImageGallery } from "@/views/d2-1/attribute-image-gallery";
import { AttributePriceMonthly } from "@/views/d2-1/attribute-price-monthly";
import { DetailViewR1 } from "@/views/d2-1/detail-view-r1";
import { ItemViewR1 } from "@/views/d2-1/item-view-r1";

export const meridianConfig = {
  customItemViewTypes: [{ type: "r1", view: ItemViewR1 }],
  customAttributeTypes: [
    { type: "price-monthly", view: AttributePriceMonthly },
    { type: "image-gallery", view: AttributeImageGallery },
  ],
  customDetailViewTypes: [{ type: "r1", view: DetailViewR1, defaultSpec: {} }],
  onOpenDetailNewPage: (item: any) => {
    window.location.href = `/d2-1/${item?.id}`;
  },
  onOpenOverviewNewPage: () => {
    window.location.href = "/d2-1";
  },
};
