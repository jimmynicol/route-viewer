import React from "react";
import cw from "classnames";

import { useUnitsContext } from "../../contexts/Units";
import { DetailedSegment } from "../../data/stravaDataTypes";
import {
    distanceStr,
    elevationStr,
    unitsStr,
} from "../../utils/unitConversions";

import styles from "./SegmentItem.module.css";
import typography from "../../styles/Typography.module.css";
import { ForwardChevronIcon } from "../Icons/ForwardChevronIcon";

export const SegmentItem: React.ComponentType<{
    segment: DetailedSegment;
    index: number;
    onSegmentSelect: (value: DetailedSegment) => void;
}> = ({ segment, index, onSegmentSelect }) => {
    const { units } = useUnitsContext();

    const distance = distanceStr(units, segment.distance, 2);
    const elevation = elevationStr(units, segment.total_elevation_gain, 0);

    return (
        <div
            className={styles.segmentItem}
            onClick={() => onSegmentSelect(segment)}
        >
            <p className={cw(styles.index, typography.bodyReduced)}>
                {index + 1}
            </p>
            <h3 className={cw(styles.segmentName, typography.subTitle)}>
                {segment.name}
            </h3>
            <p className={cw(styles.description, typography.body)}>
                <span>
                    {distance}
                    {unitsStr(units, "km")}
                </span>
                <span>
                    {elevation}
                    {unitsStr(units, "m")}
                </span>
                <span>{segment.average_grade}%</span>
            </p>
            <ForwardChevronIcon className={styles.forwardChevron} />
        </div>
    );
};
