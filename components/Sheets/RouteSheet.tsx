import React, { useEffect, useRef, useState } from "react";

import { DetailedSegment, Route } from "../../data/stravaDataTypes";
import { Sheet, SheetViewState } from "../Sheets/Sheet";
import { SheetMetadata } from "../Misc/SheetMetadata";
import { SheetTitle } from "../Misc/SheetTitle";
import {
    distanceStr,
    elevationStr,
    unitsStr,
} from "../../utils/unitConversions";
import { useUnitsContext } from "../../contexts/Units";

import { segmentListItems } from "../Misc/SegmentListItems";
import { SizeClass, useHorizontalSizeClass } from "../../utils/useSizeClass";
import { MetadataContainer } from "../Misc/MetadataContainer";

import typography from "../../styles/Typography.module.css";

export const RouteSheet: React.ComponentType<{
    route: Route | undefined;
    segments: DetailedSegment[];
    viewState: SheetViewState;
    setViewState: (value: SheetViewState) => void;
    onSegmentSelect: (value: DetailedSegment) => void;
}> = ({ route, segments, viewState, setViewState, onSegmentSelect }) => {
    const sizeClass = useHorizontalSizeClass();
    const { units } = useUnitsContext();
    const titleRef = useRef<HTMLDivElement>(null);
    const [segmentListHeight, setSegmentListHeight] = useState(0);
    const [defaultHeight, setDefaultHeight] = useState(0);
    const [showText, setShowText] = useState(false);

    const link = `https://www.strava.com/routes/${route?.id_str}`;
    const distance = distanceStr(units, route?.distance, 2);
    const elevation = elevationStr(units, route?.elevation_gain, 0);
    const numSegments = (segments || []).length.toFixed(0);
    const insetInlineStart = sizeClass === SizeClass.COMPACT ? 0 : 30;

    useEffect(() => {
        const titleEl = titleRef.current;
        const componentEl = titleEl?.parentElement;

        if (!titleEl || !componentEl) return;

        const componentRect = componentEl.getBoundingClientRect();
        const titleRect = titleEl.getBoundingClientRect();
        const listHeight = componentRect.height - titleRect.height;

        setSegmentListHeight(listHeight);
        setDefaultHeight(titleRect.height + 30);
    }, [viewState, titleRef, setSegmentListHeight, setDefaultHeight]);

    if (!route) return <div></div>;

    return (
        <Sheet
            viewState={viewState}
            onChangeViewState={setViewState}
            defaultHeight={defaultHeight}
            style={{ insetInlineStart: insetInlineStart }}
        >
            <div ref={titleRef}>
                <SheetTitle title={route.name} link={link} />
                <MetadataContainer>
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
                </MetadataContainer>
            </div>
            <div
                style={{
                    height: `${segmentListHeight}px`,
                    overflowY: "scroll",
                }}
            >
                {segmentListItems(segments, onSegmentSelect)}

                <div
                    className={typography.caption}
                    style={{ textAlign: "center", margin: 30 }}
                    onClick={() => setShowText(!showText)}
                >
                    {showText ? "Hide Text" : "Show Text"}
                </div>
                {showText && <SegmentsTextList segments={segments} />}
            </div>
        </Sheet>
    );
};

const SegmentsTextList: React.ComponentType<
    { segments: DetailedSegment[] } & React.HTMLAttributes<HTMLDivElement>
> = ({ segments }) => {
    return (
        <div>
            {segments.map((segment: DetailedSegment, i: number) => (
                <p key={i} className={typography.caption}>
                    <span>{i + 1}. </span>
                    {segment.name}:{" "}
                    <a href="https://www.strava.com/segments/{segment.id}">
                        https://www.strava.com/segments/{segment.id}
                    </a>{" "}
                    - ({segment.xoms.kom} / {segment.xoms.qom})
                </p>
            ))}
        </div>
    );
};
