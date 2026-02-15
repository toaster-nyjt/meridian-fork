export const toTitleCase = (str: string) =>
  str
    .replace(/[-_]/g, " ")   // Replace hyphens/underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word


export interface XYPosition {
  x: number;
  y: number;
}

export interface XYSize {
  width: number;
  height: number;
}

export const uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random()*16|0, v = c == "x" ? r : (r&0x3|0x8);
    return v.toString(16);
  });
};