import { Units } from "../data/useUnits";

export function metersToFeet(meters: number) {
    return meters * 3.28084;
}

export function metersToKilometers(meters: number) {
    return meters / 1000;
}

export function metersToMiles(meters: number) {
    return meters * 0.000621371;
}

export function unitsStr(units: Units, metricStr: string): string {
    let str = "";

    switch (metricStr) {
        case "km":
            str = units === Units.IMPERIAL ? "mi" : "km";
            break;
        case "m":
            str = units === Units.IMPERIAL ? "ft" : "m";
            break;
    }

    return str;
}

export function distanceStr(
    units: Units,
    meters: number | undefined,
    signficantFigures = 2
) {
    if (meters === undefined) return "0";

    if (units === Units.METRIC) {
        return metersToKilometers(meters).toFixed(signficantFigures);
    }

    return metersToMiles(meters).toFixed(signficantFigures);
}

export function elevationStr(
    units: Units,
    meters: number | undefined,
    signficantFigures = 0
) {
    if (meters === undefined) return "0";

    if (units === Units.METRIC) {
        return meters.toFixed(signficantFigures);
    }

    return metersToFeet(meters).toFixed(signficantFigures);
}

export function timeStrToSeconds(str = ""): number {
    if (str.includes("s")) return parseInt(str);

    const parts = str.split(":").map((i) => parseInt(i));
    const partsLen = parts.length;
    switch (partsLen) {
        case 1:
            parts.unshift(0);
            parts.unshift(0);
            break;
        case 2:
            parts.unshift(0);
            break;
        default:
            break;
    }

    const [hours, minutes, seconds] = parts;

    return hours * 60 * 60 + minutes * 60 + seconds;
}

export function secondsToMinutes(seconds: number): string {
    const secStr = `${seconds % 60}`;
    return `${Math.floor(seconds / 60)}:${secStr.padStart(2, "0")}`;
}
