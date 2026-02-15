import {
  AttributeType,
  AttributeValueType,
  ItemViewConfig,
  Role,
  Attribute,
  getAttributesByRole,
  ViewOptions,
  FetchedItemType,
  FetchedAttributeValueType,
  FetchedAttributeType,
  useODI,
} from "meridian-ui";
import { useDragStore } from "@/store/drag.store";
import interact from "interactjs";
import { useStyleStore } from "@/store/style.store";
import { memo, useCallback } from "react";
import { debounce } from "@/helpers/interaction.helper";

export interface ItemViewBuilderTemplateType extends ItemViewConfig {
  type: "builder-template";
}

export const ItemViewBuilderTemplate: React.FC<{
  options: ViewOptions;
  item: FetchedItemType;
  index: number;
}> = memo(({ options, item, index }) => {
  if (!item) return null;
  const { odi, addAttributeBinding } = useODI();
  const { setRoleToDropOn } = useDragStore();

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

  const { itemViewStyles, setItemViewStyle } = useStyleStore();

  const unlabeledAttributes =
    item.attributes.filter((attr) => !attr?.roles?.length) ?? [];
  // const unlabeledAttributes =
  //   confirmGroup(item)?.attributes.filter((attr) => !attr?.role) ?? [];

  const FillerComponent = memo(({ role }: { role: string }) => {
    const draggedItem = useDragStore((state: any) => state.draggedItem);
    const setDraggedItem = useDragStore((state: any) => state.setDraggedItem);
    const roleToDropOn = useDragStore((state: any) => state.roleToDropOn);
    const setRoleToDropOn = useDragStore((state: any) => state.setRoleToDropOn);

    // Debounced version of setRoleToDropOn
    const debouncedSetRoleToDropOn = useCallback(
      debounce((role: string) => {
        setRoleToDropOn(role);
      }, 100),
      [setRoleToDropOn]
    );

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
            roles: [role],
          };
          addAttributeBinding(bindingAttribute);
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
      ]
    );

    const isHighlighted = roleToDropOn === role;

    return (
      <div
        className={`flex w-full justify-center items-center px-3 italic transition-all ${
          isHighlighted
            ? "text-blue-500 bg-blue-100"
            : "text-gray-500 bg-gray-100"
        }`}
        style={{
          display: "flex",
          width: "inherit",
          height: "inherit",
          minHeight: "24px",
          fontSize: "12px",
          borderRadius: "4px",
          fontFamily: "monospace",
        }}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDrop={handleDrop}
      >
        {role}
      </div>
    );
  });

  const filler = (role: string): FetchedAttributeValueType => ({
    id: "",
    type: "element",
    index: 0,
    itemIndex: index,
    overviewIndex: item.overviewIndex ?? 0,
    path: "",
    value: <FillerComponent role={role} />,
  });

  const getAttributesByRoleWithFiller = (
    role: string
  ): FetchedAttributeType[] => {
    // console.log('test', item);
    const attributes = getAttributesByRole(item, role as Role);
    return attributes?.length ? [...attributes] : [filler(role)];
  };

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

  return (
    <div
      className={`resize ${
        options.overview.type === "grid" ? "w-[500px]" : "w-[960px]"
      } min-w-[160px] select-none relative flex flex-col gap-4 p-2 transition border-2 border-transparent hover:border-2 hover:border-blue-400 resize-drag`}
      style={{ ...itemViewStyles[options.viewType] }}
      onDragEnter={handleContainerDragEnter}
    >
      <div className="flex gap-2">
        <div className="flex flex-col items-center gap-1">
          {/* Thumbnail */}
          <Attribute
            className="w-[200px] h-[240px] overflow-hidden"
            style={{
              width: "200px",
              height: "200px",
            }}
            options={options}
            attribute={getAttributesByRoleWithFiller("thumbnail")}
          />
          {/* Caption */}
          <Attribute
            // className="w-[200px] h-[240px] overflow-hidden"
            options={options}
            attribute={getAttributesByRoleWithFiller("caption")}
          />
        </div>
        {/* Main Content Section */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {["title", "subtitle"].map(
              (role) =>
                getAttributesByRoleWithFiller(role as Role) && (
                  <Attribute
                    key={role}
                    className={
                      role === "title"
                        ? "text-xl"
                        : role === "subtitle"
                        ? "text-gray-400"
                        : "text-sm"
                    }
                    options={options}
                    attribute={getAttributesByRoleWithFiller(role)}
                  />
                )
            )}
          </div>
          <div className="flex flex-col gap-2">
            {["description", "key-attribute"].map(
              (role) =>
                getAttributesByRoleWithFiller(role as Role) && (
                  <Attribute
                    key={role}
                    className={"text-sm"}
                    options={options}
                    attribute={getAttributesByRoleWithFiller(role)}
                  />
                )
            )}
          </div>
          {/* Unlabeled Attributes (Supplementary Content) */}
          {/* {unlabeledAttributes.length > 0 && (
            <div className="flex flex-col gap-1 text-sm">
              {unlabeledAttributes.map((attr, idx) => (
                <Attribute
                  key={idx}
                  options={options}
                  attribute={getAttributesByRoleWithFiller('No Role')}
                />
              ))}
            </div>
          )} */}
          {/* Tags */}
          <div className="flex gap-2 text-sm">
            <Attribute
              options={options}
              attribute={getAttributesByRoleWithFiller("tag")}
            />
          </div>
          {/* Action Links */}
          <div className="flex flex-col gap-2 text-sm">
            <Attribute
              options={options}
              attribute={getAttributesByRoleWithFiller("action")}
            />
            <Attribute
              options={options}
              attribute={getAttributesByRoleWithFiller("link")}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {/* Specs */}
        <Attribute
          options={options}
          attribute={getAttributesByRoleWithFiller("spec")}
        />

        {/* Footer */}
        <Attribute
          options={options}
          attribute={getAttributesByRoleWithFiller("footer")}
        />
      </div>

      {/* Badge */}
      <Attribute
        className="absolute top-0 left-0 z-100 bg-white rounded m-1 shadow-lg"
        options={options}
        attribute={getAttributesByRoleWithFiller("badge")}
      />
    </div>
  );
});
