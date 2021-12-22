import { useMedia } from "react-use";

export enum ColorScheme {
    LIGHT,
    DARK,
}

export function useColorScheme() {
    const isDarkMode = useMedia("(prefers-color-scheme: dark)", false);
    return isDarkMode ? ColorScheme.DARK : ColorScheme.LIGHT;
}
