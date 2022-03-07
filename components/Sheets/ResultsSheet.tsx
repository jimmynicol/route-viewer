import React, { useEffect, useState } from "react";

import { Sheet, SheetViewState } from "./Sheet";
import { useAthleteDataContext } from "../../contexts/AthleteData";
import { RiderResultsView } from "./ResultsSheetViews/RiderResultsView";

import styles from "./ResultsSheet.module.css";
import { RidersView } from "./ResultsSheetViews/RidersView";

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
    const [wrapperHeight, setWrapperHeight] = useState(0);

    useEffect(() => {
        setSheetViewState(
            type === ResultSheetViewType.EMPTY
                ? SheetViewState.HIDE
                : SheetViewState.FULL
        );
    }, [type, setSheetViewState]);

    useEffect(() => {
        if (sheetViewState === SheetViewState.DEFAULT) onHide();
    }, [sheetViewState, onHide]);

    useEffect(() => {
        setWrapperHeight(fullHeight - 20);
    }, [fullHeight, setWrapperHeight]);

    let content;

    switch (type) {
        case ResultSheetViewType.MY_RESULTS:
            content = (
                <RiderResultsView athleteId={athleteData.id}></RiderResultsView>
            );
            break;
        case ResultSheetViewType.RIDER:
            content = (
                <RiderResultsView athleteId={typeData}></RiderResultsView>
            );
            break;
        case ResultSheetViewType.RIDERS:
            content = <RidersView />;
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
            <div className={styles.wrapper} style={{ height: wrapperHeight }}>
                {content}
            </div>
        </Sheet>
    );
};
