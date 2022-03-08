import React from "react";

import { useUnitsContext } from "../../contexts/Units";
import { SummarySegment } from "../../data/stravaDataTypes";
import {
    distanceStr,
    elevationStr,
    unitsStr,
} from "../../utils/unitConversions";
import { ListItem } from "./ListItem";

import typography from "../../styles/Typography.module.css";

export const SegmentListItem: React.ComponentType<{
    segment: SummarySegment;
    index: number;
    onItemClick: (segment: SummarySegment) => void;
}> = ({ segment, index, onItemClick }) => {
    const { units } = useUnitsContext();
    const distance = distanceStr(units, segment.distance, 2);
    const elevationGain = segment.elevation_high - segment.elevation_low;
    const elevation = elevationStr(units, elevationGain, 0);

    return (
        <ListItem
            index={index + 1}
            title={segment.name}
            onClick={() => onItemClick(segment)}
        >
            <span className={typography.semanticallyReduced}>
                {distance}
                {unitsStr(units, "km")}
            </span>
            <span className={typography.semanticallyReduced}>
                {elevation}
                {unitsStr(units, "m")}
            </span>
            <span className={typography.semanticallyReduced}>
                {segment.average_grade}%
            </span>
        </ListItem>
    );
};

export function segmentListItems(
    segments: SummarySegment[],
    onItemClick: (segment: SummarySegment) => void
) {
    return segments.map((segment, index) => {
        return (
            <SegmentListItem
                key={index}
                segment={segment}
                index={index}
                onItemClick={onItemClick}
            />
        );
    });
}
