export const fixedFloat = (val: string | number, digits = 4) => {
  const input = Number(val);
  const multiplier = parseInt((input * 10 ** digits).toString());
  return multiplier / 10 ** digits;
};
