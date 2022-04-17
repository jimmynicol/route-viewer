import React, { useEffect, useState } from "react";

import { Sheet, SheetViewState } from "./Sheet";
import { RiderResultsView } from "./ResultsSheetViews/RiderResultsView";
import { RidersView } from "./ResultsSheetViews/RidersView";
import { PREffort, RiderStats } from "../../data/resultsConverter";
import { SegmentsView } from "./ResultsSheetViews/SegmentsView";
import { PRsView } from "./ResultsSheetViews/PRsView";
import { GCView } from "./ResultsSheetViews/GCView";
import { SegmentView } from "./ResultsSheetViews/SegmentView";
import { XOMView } from "./ResultsSheetViews/XOMView";
import { ClubXOMView } from "./ResultsSheetViews/ClubXOMView";

import styles from "./ResultsSheet.module.css";

export enum ResultSheetViewType {
    EMPTY,
    RIDER,
    RIDERS,
    SEGMENT,
    SEGMENTS,
    PRS,
    XOMS,
    CLUB_XOMS,
    GC,
}

export const ResultsSheet: React.ComponentType<{
    type: ResultSheetViewType;
    typeData?: any;
    onHide: () => void;
    onSegmentSelect?: (segmentId: number) => void;
    fullHeight?: number;
    defaultHeight?: number;
}> = ({
    type,
    typeData,
    onHide,
    onSegmentSelect,
    defaultHeight = -50,
    fullHeight = 500,
}) => {
    const [sheetViewState, setSheetViewState] = useState<SheetViewState>(
        SheetViewState.HIDE
    );
    const [sheetViewType, setSheetViewType] = useState<ResultSheetViewType>(
        ResultSheetViewType.EMPTY
    );
    const [sheetViewData, setSheetViewData] = useState<any>(null);

    useEffect(() => setSheetViewType(type), [type, setSheetViewType]);
    useEffect(() => setSheetViewData(typeData), [typeData, setSheetViewData]);
    useEffect(() => {
        setSheetViewState(
            sheetViewType === ResultSheetViewType.EMPTY
                ? SheetViewState.HIDE
                : SheetViewState.FULL
        );
        if (sheetViewType === ResultSheetViewType.SEGMENT && onSegmentSelect) {
            onSegmentSelect(sheetViewData);
        }
    }, [sheetViewType, sheetViewData, onSegmentSelect, setSheetViewState]);
    useEffect(() => {
        if (sheetViewState === SheetViewState.DEFAULT) onHide();
    }, [sheetViewState, onHide]);

    let content;

    switch (sheetViewType) {
        case ResultSheetViewType.PRS:
            content = (
                <PRsView
                    onItemClick={(effort: PREffort) => {
                        setSheetViewData(effort.athleteId);
                        setSheetViewType(ResultSheetViewType.RIDER);
                    }}
                />
            );
            break;
        case ResultSheetViewType.RIDER:
            content = (
                <RiderResultsView
                    athleteId={sheetViewData}
                    onSegmentClick={(segmentId: number) => {
                        setSheetViewData(segmentId);
                        setSheetViewType(ResultSheetViewType.SEGMENT);
                    }}
                />
            );
            break;
        case ResultSheetViewType.RIDERS:
            content = (
                <RidersView
                    onItemClick={(rider: RiderStats) => {
                        setSheetViewData(rider.id);
                        setSheetViewType(ResultSheetViewType.RIDER);
                    }}
                />
            );
            break;
        case ResultSheetViewType.SEGMENT:
            content = (
                <SegmentView
                    segmentId={sheetViewData}
                    onItemClick={(athleteId: string) => {
                        setSheetViewData(athleteId);
                        setSheetViewType(ResultSheetViewType.RIDER);
                    }}
                />
            );
            break;
        case ResultSheetViewType.SEGMENTS:
            content = (
                <SegmentsView
                    onItemClick={(segmentId: number) => {
                        setSheetViewData(segmentId);
                        setSheetViewType(ResultSheetViewType.SEGMENT);
                    }}
                />
            );
            break;
        case ResultSheetViewType.GC:
            content = (
                <GCView
                    genderToShow={sheetViewData}
                    onItemClick={(athleteId: string) => {
                        setSheetViewData(athleteId);
                        setSheetViewType(ResultSheetViewType.RIDER);
                    }}
                />
            );
            break;
        case ResultSheetViewType.XOMS:
            content = (
                <XOMView
                    onItemClick={(effort: PREffort) => {
                        setSheetViewData(effort.athleteId);
                        setSheetViewType(ResultSheetViewType.RIDER);
                    }}
                />
            );
            break;
        case ResultSheetViewType.CLUB_XOMS:
            content = (
                <ClubXOMView
                    onItemClick={(effort: PREffort) => {
                        setSheetViewData(effort.athleteId);
                        setSheetViewType(ResultSheetViewType.RIDER);
                    }}
                />
            );
            break;
    }

    return (
        <Sheet
            className={styles.resultsSheet}
            viewState={sheetViewState}
            defaultHeight={defaultHeight}
            fullHeight={fullHeight}
            onChangeViewState={setSheetViewState}
        >
            <div className={styles.wrapper}>{content}</div>
        </Sheet>
    );
};
