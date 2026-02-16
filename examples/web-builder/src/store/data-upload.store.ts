import { create } from "zustand";

export type AttributeTypeValue =
  | "string"
  | "number"
  | "link"
  | "image"
  | "boolean"
  | "price"
  | "button"
  | "object"
  | "array";

export interface CSVRowData {
  [key: string]: string;
}

export interface Attribute {
  attribute: string;
  type: AttributeTypeValue;
  path?: string;
  value: any;
  children?: Attribute[] | { [key: string]: Attribute };
}

interface DataUploadStore {
  file: File | null;
  data: any[];
  attributes: Attribute[];
  loading: boolean;
  error: string | null;

  importedUsageData: boolean;
  popularAttributes: string[];
  setImportedUsageData: (importedUsageData: boolean) => void;

  setFile: (file: File | null) => void;
  setAttributes: (attributes: Attribute[]) => void;
  updateAttributeType: (attributePath: string, newType: AttributeTypeValue) => void;
  parseFile: (file: File) => void;
}

export const useDataUploadStore = create<DataUploadStore>((set) => ({
  file: null,
  data: [],
  attributes: [],
  loading: false,
  error: null,

  importedUsageData: false,
  popularAttributes: ["grid", "2", "3", "6", "pop-up"],
  setImportedUsageData: (importedUsageData: boolean) => set({ importedUsageData }),

  setFile: (file) => set({ file }),
  setAttributes: (attributes) => set({ attributes }),

  updateAttributeType: (attributePath, newType) => {
    set((state) => ({
      attributes: state.attributes.map((attr) =>
        attr.path === attributePath ? { ...attr, type: newType } : attr
      ),
    }));
  },

  parseFile: (file) => {
    set({ loading: true, error: null });
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let parsedData: any[] = [];
        const fileType = file.name.toLowerCase().endsWith(".csv") ? "csv" : "json";

        if (fileType === "csv") {
          const rows = content.split("\n");
          const headers = rows[0].split(",").map((header) => header.trim());

          if (rows.length < 2) {
            set({ error: "CSV file appears to be empty or missing data rows.", loading: false });
            return;
          }

          parsedData = rows
            .slice(1)
            .map((row) => {
              if (!row.trim()) return null;
              const values = row.split(",");
              const rowData: CSVRowData = {};
              headers.forEach((header, index) => {
                if (header) {
                  rowData[header] = values[index]?.trim() || "";
                }
              });
              return rowData;
            })
            .filter((row): row is CSVRowData => row !== null);
        } else {
          parsedData = JSON.parse(content);
          if (!Array.isArray(parsedData)) {
            parsedData = [parsedData];
          }
        }

        const determineType = (value: any): AttributeTypeValue => {
          if (value === null || value === undefined) return "string";
          if (Array.isArray(value)) return "array";
          if (typeof value === "object") return "object";
          if (typeof value === "boolean") return "boolean";
          if (typeof value === "number") return "number";
          if (typeof value === "string") {
            if (/^https?:\/\/.+\.(jpg|jpeg|png|gif|bmp)$/i.test(value)) return "image";
            if (/^https?:\/\/.+/.test(value)) return "link";
          }
          return "string";
        };

        const extractAttributes = (obj: any, prefix = ""): Attribute[] => {
          return Object.entries(obj).map(([key, value]: [string, unknown]): Attribute => {
            const type = determineType(value);

            if (type === "object") {
              // Case 1: Object type - create an attribute with nested children
              // For objects, we extract all nested attributes and store them in children
              const currentPath = prefix ? `${prefix}.${key}` : key;
              const nestedAttributes = extractAttributes(value, currentPath);
              const childrenObj: { [key: string]: Attribute } = {};
              nestedAttributes.forEach(attr => {
                childrenObj[attr.attribute] = attr;
              });
              return {
                attribute: key,
                type,
                value,
                path: currentPath,
                children: childrenObj
              };
            } else if (type === "array" && Array.isArray(value) && value.length > 0) {
              // Case 2: Array handling
              if (typeof value[0] === "object") {
                // For arrays containing objects, use first item as template
                const currentPath = prefix ? `${prefix}.${key}[0]` : `${key}[0]`;
                return {
                  attribute: key,
                  type,
                  value: JSON.stringify(value),
                  path: currentPath,
                  children: extractAttributes(value[0], currentPath)
                };
              } else {
                // For arrays of primitives (strings, numbers etc), just store the array
                const currentPath = prefix ? `${prefix}.${key}` : key;
                return {
                  attribute: key,
                  type,
                  value: value.join(", "),
                  path: currentPath,
                  children: extractAttributes(value, currentPath)
                };
              }
            } else {
              // Case 3: Primitive values - create a simple attribute
              // For strings, numbers, booleans, etc. we just store the value directly
              const currentPath = prefix ? `${prefix}.${key}` : key;
              return {
                attribute: key,
                type,
                value,
                path: currentPath
              };
            }
          });
        };

        const newAttributes = parsedData.length > 0 
          ? extractAttributes(parsedData[0])
          : [];

        set({ data: parsedData, attributes: newAttributes, loading: false });
      } catch (err) {
        set({ error: `Failed to parse ${file.name}. Please check the format.`, loading: false });
      }
    };

    reader.onerror = () => {
      set({ error: "Failed to read the file.", loading: false });
    };

    reader.readAsText(file);
  },
}));
