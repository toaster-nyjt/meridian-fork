export const limitData = (data: any[]) => {
  return data.slice(0, 10);
};


export const hundredToHex = (value: number) => {
  // Convert a number from 0-100 to a hex value from 00-FF
  const normalizedValue = Math.max(0, Math.min(100, value));
  const hexValue = Math.round(normalizedValue * 255 / 100).toString(16).padStart(2, "0");
  return hexValue;
};
