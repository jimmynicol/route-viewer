import React from "react";
import cw from "classnames";

import { TalliedRideEfforts } from "../../data/resultsConverter";
import { distanceStr, unitsStr } from "../../utils/unitConversions";
import { useUnitsContext } from "../../contexts/Units";

import typography from "../../styles/Typography.module.css";

export const SegmentStats: React.ComponentType<{
    talliedData: TalliedRideEfforts;
    classNames?: string[];
}> = ({ talliedData, classNames }) => {
    const { units } = useUnitsContext();

    return (
        <ul className={cw(typography.bodySmall, ...(classNames || []))}>
            <li>
                Longest Segment:{" "}
                <strong>{talliedData.stats.longestSegment[0]}</strong> (
                {distanceStr(units, talliedData.stats.longestSegment[1], 2)}{" "}
                {unitsStr(units, "km")})
            </li>
            <li>
                Steepest Segment:{" "}
                <strong>{talliedData.stats.steepestSegment[0]}</strong> (
                {talliedData.stats.steepestSegment[1]}%)
            </li>
            <li>
                Most PRed Segment:{" "}
                <strong>{talliedData.stats.segmentWithMostPRs[0]}</strong> (
                {talliedData.stats.segmentWithMostPRs[1]})
            </li>
        </ul>
    );
};
