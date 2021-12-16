import { useLocalStorage } from "./useLocalStorage";

export enum Units {
    IMPERIAL = "imperial",
    METRIC = "metric",
}

export function useUnits() {
    const key = "route-viewer.units";
    return useLocalStorage<Units>(key, Units.METRIC);
}
