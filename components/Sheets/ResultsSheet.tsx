import React, { useEffect, useState } from "react";

import { Sheet, SheetViewState } from "./Sheet";
import { useAthleteDataContext } from "../../contexts/AthleteData";
import { RiderResultsView } from "./ResultsSheetViews/RiderResultsView";

import styles from "./ResultsSheet.module.css";
import { RidersView } from "./ResultsSheetViews/RidersView";
import { PREffort, RiderStats } from "../../data/resultsConverter";
import { SegmentsView } from "./ResultsSheetViews/SegmentsView";
import { SummarySegment } from "../../data/stravaDataTypes";
import { PRsView } from "./ResultsSheetViews/PRsView";
import { GCView } from "./ResultsSheetViews/GCView";

export enum ResultSheetViewType {
    EMPTY,
    MY_RESULTS,
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
    fullHeight?: number;
    defaultHeight?: number;
}> = ({ type, typeData, onHide, defaultHeight = -50, fullHeight = 500 }) => {
    const { athleteData } = useAthleteDataContext();
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
    }, [sheetViewType, setSheetViewState]);

    useEffect(() => {
        if (sheetViewState === SheetViewState.DEFAULT) onHide();
    }, [sheetViewState, onHide]);

    let content;

    switch (sheetViewType) {
        case ResultSheetViewType.MY_RESULTS:
            content = <RiderResultsView athleteId={athleteData.id} />;
            break;
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
            content = <RiderResultsView athleteId={sheetViewData} />;
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
        case ResultSheetViewType.SEGMENTS:
            content = (
                <SegmentsView
                    onItemClick={(segment: SummarySegment) => {
                        setSheetViewData(segment);
                        setSheetViewType(ResultSheetViewType.SEGMENT);
                    }}
                />
            );
            break;
        case ResultSheetViewType.GC:
            content = (
                <GCView
                    onItemClick={(athleteId: string) => {
                        setSheetViewData(athleteId);
                        setSheetViewType(ResultSheetViewType.RIDER);
                    }}
                />
            );
            break;
        default:
            content = (
                <div>
                    <h3>sheet contents</h3>
                </div>
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
