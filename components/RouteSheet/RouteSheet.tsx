import React, { useEffect, useRef, useState } from "react";

import { DetailedSegment, Route } from "../../data/stravaDataTypes";
import { Sheet, SheetViewState } from "../Sheet/Sheet";
import { SheetMetadata } from "../SheetMetadata/SheetMetadata";
import { SheetTitle } from "../SheetTitle/SheetTitle";

import styles from "../Sheet/Sheet.module.css";
import { SegmentItem } from "../SegmentItem/SegmentItem";
import {
    distanceStr,
    elevationStr,
    unitsStr,
} from "../../utils/unitConversions";
import { useUnitsContext } from "../../contexts/Units";

export const RouteSheet: React.ComponentType<{
    route: Route | undefined;
    segments: DetailedSegment[];
    viewState: SheetViewState;
    setViewState: (value: SheetViewState) => void;
    onSegmentSelect: (value: DetailedSegment) => void;
}> = ({ route, segments, viewState, setViewState, onSegmentSelect }) => {
    const { units } = useUnitsContext();
    const titleRef = useRef<HTMLDivElement>(null);
    const [segmentListHeight, set] = useState(0);

    const link = `https://www.strava.com/routes/${route?.id_str}`;
    const distance = distanceStr(units, route?.distance, 2);
    const elevation = elevationStr(units, route?.elevation_gain, 0);
    const numSegments = (segments || []).length.toFixed(0);

    useEffect(() => {
        const titleEl = titleRef.current;
        if (!titleEl) return;
        const titleRect = titleEl.getBoundingClientRect();
        const listHeight = window.innerHeight - 50 - 26 - titleRect.height;
        set(listHeight);
    }, [titleRef, set]);

    return (
        <Sheet
            viewState={viewState}
            parentName="RouteSheet"
            onChangeViewState={setViewState}
        >
            <div ref={titleRef}>
                <SheetTitle title={route?.name} link={link} />
                <div className={styles.metadataContainer}>
                    <SheetMetadata
                        num={distance}
                        unit={unitsStr(units, "km")}
                        description={"Distance"}
                    />
                    <SheetMetadata
                        num={elevation}
                        unit={unitsStr(units, "m")}
                        description={"Elevation"}
                    />
                    <SheetMetadata
                        num={numSegments}
                        unit={""}
                        description={"Segments"}
                        onClick={() => setViewState(SheetViewState.FULL)}
                    />
                </div>
            </div>
            <div
                style={{
                    height: `${segmentListHeight}px`,
                    overflowY: "scroll",
                }}
            >
                {segments.map((segment, i) => (
                    <SegmentItem
                        segment={segment}
                        index={i}
                        key={i}
                        onSegmentSelect={onSegmentSelect}
                    />
                ))}
            </div>
        </Sheet>
    );
};
