import {
  AttributeType,
  AttributeValueType,
  ItemViewConfig,
  Attribute,
  ViewOptions,
  FetchedItemType,
  FetchedAttributeType,
  useODI,
} from "meridian-ui";
import { useDragStore } from "@/store/drag.store";
import interact from "interactjs";
import { useStyleStore } from "@/store/style.store";
import { memo, useCallback } from "react";
import { debounce } from "@/helpers/interaction.helper";

export interface ItemViewBuilderFreeformType extends ItemViewConfig {
  type: "builder-freeform";
}

export const ItemViewBuilderFreeform: React.FC<{
  options: ViewOptions;
  item: FetchedItemType;
  index: number;
}> = memo(({ options, item, index }) => {
  if (!item) return null;
  const { addAttributeBinding, removeAttributeBinding } = useODI();
  const { setRoleToDropOn } = useDragStore();

  // Debounced version of setRoleToDropOn
  const debouncedSetRoleToDropOn = useCallback(
    debounce((role: string | null) => {
      setRoleToDropOn(role);
    }, 50),
    [setRoleToDropOn]
  );

  const {
    itemViewStyles,
    setItemViewStyle,
    attributeStyles,
    selectedId,
    setAttributeStyle,
    setSelectedObject,
  } = useStyleStore();
  // Define the drag move listener function
  const dragMoveListener = useCallback(
    (event: any) => {
      const target = event.target;
      const classList = target.className.split(" ");
      const attributeIdClass = classList.find((cls: string) =>
        cls.startsWith("attrId:")
      );
      const attributeId = attributeIdClass
        ? attributeIdClass.split(":")[1]
        : null;

      if (attributeId && attributeStyles[attributeId]) {
        setSelectedObject("attribute", attributeId);

        // Parse current position values, removing 'px' and converting to numbers
        const currentLeft =
          parseFloat(
            attributeStyles[attributeId].left?.toString().replace("px", "")
          ) || 0;
        const currentTop =
          parseFloat(
            attributeStyles[attributeId].top?.toString().replace("px", "")
          ) || 0;

        // Update the attribute style in the store
        setAttributeStyle(attributeId, {
          ...attributeStyles[attributeId],
          left: `${currentLeft + event.dx}px`,
          top: `${currentTop + event.dy}px`,
        });
      }
    },
    [setSelectedObject, setAttributeStyle, attributeStyles]
  );

  // Make elements both resizable and draggable
  interact(".drag-resize")
    .resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      margin: 10,
      listeners: {
        move(event) {
          const target = event.target;
          const classList = target.className.split(" ");
          const attributeIdClass = classList.find((cls: string) =>
            cls.startsWith("attrId:")
          );
          const attributeId = attributeIdClass
            ? attributeIdClass.split(":")[1]
            : null;

          if (attributeId && attributeStyles[attributeId]) {
            setSelectedObject("attribute", attributeId);

            // Parse current position values, removing 'px' and converting to numbers
            const currentLeft =
              parseFloat(
                attributeStyles[attributeId].left?.toString().replace("px", "")
              ) || 0;
            const currentTop =
              parseFloat(
                attributeStyles[attributeId].top?.toString().replace("px", "")
              ) || 0;

            // Calculate new position based on which edge is being resized
            const newLeft =
              event.edges.left || event.edges.right
                ? currentLeft +
                  (event.edges.left
                    ? event.deltaRect.left
                    : event.deltaRect.right) /
                    2
                : currentLeft;
            const newTop =
              event.edges.top || event.edges.bottom
                ? currentTop +
                  (event.edges.top
                    ? event.deltaRect.top
                    : event.deltaRect.bottom) /
                    2
                : currentTop;

            // Update the attribute style in the store
            setAttributeStyle(attributeId, {
              ...attributeStyles[attributeId],
              width: `${event.rect.width}px`,
              height: `${event.rect.height}px`,
              left: `${newLeft}px`,
              top: `${newTop}px`,
            });
          }
        },
        end(event) {
          setSelectedObject("attribute", "");
        },
      },
      modifiers: [
        interact.modifiers.restrictSize({
          min: { width: 10, height: 10 },
        }),
      ],
    })
    .draggable({
      listeners: { move: dragMoveListener },
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: "parent",
          endOnly: true,
        }),
      ],
    });

  interact(".resize").resizable({
    edges: { left: false, right: true, bottom: true, top: false },
    listeners: {
      move(event) {
        const target = event.target;

        setItemViewStyle(options.viewType, {
          width: event.rect.width + "px",
          height: event.rect.height + "px",
        });
      },
    },
    modifiers: [
      interact.modifiers.restrictSize({
        min: { width: 100, height: 50 },
      }),
    ],
  });

  const role = "item";
  const { draggedItem, setDraggedItem, roleToDropOn } = useDragStore();

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (roleToDropOn !== role) {
        debouncedSetRoleToDropOn(role);
      }
    },
    [role, roleToDropOn, debouncedSetRoleToDropOn]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (draggedItem && roleToDropOn === role) {
        const bindingAttribute: AttributeType = {
          value: `.${draggedItem.path}`,
          type: draggedItem.type as AttributeValueType,
          roles: [],
        };

        // Calculate position relative to the container
        const containerRect = e.currentTarget.getBoundingClientRect();
        const dropX = e.clientX - containerRect.left;
        const dropY = e.clientY - containerRect.top;

        // Add the attribute first to get its ID
        const newAttribute = addAttributeBinding(bindingAttribute);

        // Set the position style for the new attribute, centering it at the drop point
        if (newAttribute?.value) {
          setAttributeStyle(newAttribute?.value, {
            position: "absolute",
            left: `${dropX}px`,
            top: `${dropY}px`,
            transform: "translate(-50%, -50%)",
            transformOrigin: "center center",
          });
        }

        setDraggedItem(null);
        setRoleToDropOn(null);
      }
    },
    [
      draggedItem,
      roleToDropOn,
      role,
      addAttributeBinding,
      setDraggedItem,
      setRoleToDropOn,
      setAttributeStyle,
    ]
  );

  const isHighlighted = roleToDropOn === role;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, attr: FetchedAttributeType) => {
      if (e.key === "Delete" && attr?.path === selectedId) {
        // Remove the attribute binding from ODI state
        if (attr?.path) {
          removeAttributeBinding({
            value: attr.path,
            type: attr.type as AttributeValueType,
            roles: [],
          });
        }
        // Clear the selection
        setSelectedObject("attribute", "");
      }
    },
    [selectedId, setSelectedObject, removeAttributeBinding]
  );

  return (
    <div
      className={`resize relative ${
        options.overview.type === "grid" ? "w-[500px]" : "w-[960px]"
      } ${
        isHighlighted ? "bg-blue-50" : ""
      } h-[160px] min-w-[160px] select-none relative flex flex-col gap-4 p-2 transition border-2 border-gray-300 rounded-md hover:border-2 hover:border-blue-400 resize-drag`}
      style={{ ...itemViewStyles[options.viewType] }}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDrop={handleDrop}
      onClick={() => setSelectedObject("attribute", "")}
    >
      {item.attributes.filter(Boolean).map((attr) => (
        <div
          // className={
          //   selectedId === attr?.id
          //     ? 'outline-2 outline-blue-400 hover:outline-blue-400'
          //     : 'hover:outline-blue-400'
          // }
          key={attr?.id}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedObject("attribute", attr?.path ?? "");
          }}
          onKeyDown={(e) => handleKeyDown(e, attr)}
        >
          <Attribute
            className={
              (selectedId === attr?.path
                ? "outline-2 outline-blue-400 hover:outline-blue-400"
                : "outline-1 outline-transparent hover:outline-blue-400") +
              ` absolute attrId:${attr?.path} drag-resize align-start
              ${
                "type" in attr! && attr.type === "image"
                  ? "w-[200px] h-[240px] overflow-hidden"
                  : ""
              }`
            }
            style={attributeStyles[attr?.path || ""]}
            options={options}
            attribute={attr}
          />
        </div>
      ))}
    </div>
  );
});
