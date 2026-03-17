import * as Constants from "expo-constants";

export const MARGIN_TOP = (() => {
  const height = Constants.default.statusBarHeight;
  if (height > 40) return "mt-16";
  if (height > 20) return "mt-12";
  return "mt-0";
})();
