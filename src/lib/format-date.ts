export const formatDateLocal = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatDisplayRange = (value: string) => {
  const [from, to] = value.split("_");
  if (!from || !to) return "";
  return `${from} - ${to}`;
};

export const parseRange = (value: string) => {
  const [from, to] = value.split("_");

  if (!from || !to) return undefined;

  return {
    from: new Date(from),
    to: new Date(to),
  };
};
