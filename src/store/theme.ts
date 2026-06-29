import { useColorScheme } from "react-native";

export const theme = {
  light: { bg: "#F4F6FA", card: "#FFFFFF", text: "#0B1E3F", sub: "#5B6B85", accent: "#22C55E", navy: "#0B1E3F" },
  dark: { bg: "#071528", card: "#13294B", text: "#E6ECF5", sub: "#9AB0CC", accent: "#22C55E", navy: "#0B1E3F" }
};

export function useTheme() {
  const scheme = useColorScheme();
  return scheme === "dark" ? theme.dark : theme.light;
}
