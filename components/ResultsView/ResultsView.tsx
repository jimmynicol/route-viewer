import React, { useEffect, useRef, useState } from "react";
import cw from "classnames";

import { SizeClass, useHorizontalSizeClass } from "../../utils/useSizeClass";
import { riderResultsToHighlightString } from "../../data/resultsConverter";
import { HR } from "../Misc/HR";
import { StravaSignInButton } from "../OAuth/StravaSignInButton";
import { AuthState, useAuthStateContext } from "../../contexts/AuthState";
import { ForwardChevronIcon } from "../Icons/ForwardChevronIcon";
import { TitleLockup } from "./TitleLockup";
import { RideStats } from "./RideStats";
import { EffortStats, EffortStatsTypes } from "./EffortStats";
import { GeneralClassificationList } from "./GeneralClassificationList";
import { SegmentStats } from "./SegmentStats";
import {
    ResultsDataState,
    useResultsDataContext,
} from "../../contexts/ResultsData";
import { isEmpty } from "../../utils/isEmpty";
import { MyResults } from "./MyResults";
import { ResultSheetViewType, ResultsSheet } from "../Sheets/ResultsSheet";
import { Controls } from "../Controls/Controls";
import { UnitSwitcher } from "../Controls/UnitSwitcher";

import styles from "./ResultsView.module.css";
import typography from "../../styles/Typography.module.css";
import errorStyles from "../../styles/ErrorMessage.module.css";
import loadingStyles from "../../styles/LoadingMessage.module.css";
import { Map } from "../Map/Map";
import { DetailedSegment } from "../../data/stravaDataTypes";

const DEFAULT_HEIGHT = -50;

export const ResultsView: React.ComponentType = () => {
    const sizeClass = useHorizontalSizeClass();
    const { authState } = useAuthStateContext();
    const { resultsDataState, results, talliedResults } =
        useResultsDataContext();

    const viewRef = useRef<HTMLDivElement>(null);
    const titleLockupRef = useRef<HTMLDivElement>(null);

    const [wrapperHeight, setWrapperHeight] = useState<number>(500);
    const [sheetFullHeight, setSheetFullHeight] = useState<number>(0);
    const [sheetViewType, setSheetViewType] = useState<ResultSheetViewType>(
        ResultSheetViewType.EMPTY
    );
    const [sheetViewData, setSheetViewData] = useState<any>(null);
    const [currentSegment, setCurrentSegment] =
        useState<DetailedSegment | null>(null);

    const handleSheetState = (value: any, data?: any) => {
        switch (value) {
            case EffortStatsTypes.RIDERS:
                setSheetViewType(ResultSheetViewType.RIDERS);
                break;
            case EffortStatsTypes.PRS:
                setSheetViewType(ResultSheetViewType.PRS);
                break;
        }
    };

    useEffect(() => {
        const viewElement = viewRef.current;
        const titleLockupElement = titleLockupRef.current;
        if (!viewElement || !titleLockupElement) return;

        const viewElementHeight = viewElement.getBoundingClientRect().height;

        setWrapperHeight(
            viewElementHeight -
                titleLockupElement.getBoundingClientRect().height
        );
        setSheetFullHeight(viewElementHeight - DEFAULT_HEIGHT - 100);
    }, [
        resultsDataState,
        viewRef,
        titleLockupRef,
        setWrapperHeight,
        setSheetFullHeight,
    ]);

    if (resultsDataState === ResultsDataState.LOADING) {
        return (
            <div className={loadingStyles.loadingMessage}>
                <h2
                    className={cw(loadingStyles.title, typography.titleReduced)}
                >
                    Results Data Loading...
                </h2>
            </div>
        );
    }

    if (resultsDataState === ResultsDataState.ERROR) {
        return (
            <div className={errorStyles.errorMessage}>
                <div
                    className={
                        sizeClass === SizeClass.COMPACT
                            ? errorStyles.compact
                            : errorStyles.regular
                    }
                >
                    <h2
                        className={cw(
                            errorStyles.title,
                            typography.titleReduced
                        )}
                    >
                        Results Set Could Not Be Found.
                    </h2>
                    <p
                        className={cw(
                            errorStyles.description,
                            typography.bodyReduced
                        )}
                    >
                        Please check the URL before continuing.
                    </p>
                </div>
            </div>
        );
    }

    if (isEmpty(results) || isEmpty(talliedResults)) {
        return <div></div>;
    }

    // console.log(results);
    // console.log(talliedResults);

    const sizeClassClass =
        sizeClass === SizeClass.COMPACT
            ? styles.compactSizeClass
            : styles.regularSizeClass;

    const mapSegments = Object.values(results.segments).map(
        (seg) => seg.segment
    );

    return (
        <div>
            {sizeClass === SizeClass.REGULAR && (
                <div
                    style={{
                        height: "100vh",
                        width: "calc(100% - 375)",
                        position: "relative",
                        marginInlineStart: 375,
                    }}
                >
                    <Map
                        route={results.route}
                        segments={mapSegments || []}
                        currentSegment={currentSegment}
                        setCurrentSegment={setCurrentSegment}
                        shouldShowUnitUserControls={false}
                    />
                </div>
            )}
            <div
                ref={viewRef}
                className={cw(styles.resultsView, sizeClassClass)}
            >
                <TitleLockup ref={titleLockupRef} data={results} />
                <div
                    className={cw(styles.scrollWrapper)}
                    style={{ height: wrapperHeight }}
                >
                    <div className={cw(styles.statsContainer)}>
                        <RideStats
                            distance={results.route.distance}
                            elevationGain={results.route.elevation_gain}
                            numberOfSegments={results.segmentsInOrder.length}
                            onSegmentsClick={() =>
                                setSheetViewType(ResultSheetViewType.SEGMENTS)
                            }
                        />
                        <HR />
                        <EffortStats
                            riders={talliedResults.stats.numberOfRiders}
                            prs={talliedResults.stats.numberOfPRs}
                            xoms={talliedResults.stats.numberOfXOMs}
                            clubXOMs={talliedResults.stats.numberOfClubXoms}
                            onClick={handleSheetState}
                        />
                        <HR />
                        <SegmentStats
                            classNames={[styles.routeStats]}
                            talliedData={talliedResults}
                        />
                        <HR />
                        {authState !== AuthState.VALID && (
                            <div className={cw(styles.myResults)}>
                                <div>
                                    <h2 className={cw(typography.titleReduced)}>
                                        My Results
                                    </h2>
                                    <p className={cw(typography.caption)}>
                                        Log into Strava to see your results.
                                    </p>
                                </div>
                                <StravaSignInButton />
                            </div>
                        )}
                        {authState === AuthState.VALID && (
                            <MyResults
                                className={styles.myResults}
                                onItemClick={(athleteId: string) => {
                                    setSheetViewData(athleteId);
                                    setSheetViewType(ResultSheetViewType.RIDER);
                                }}
                            />
                        )}
                        <HR />
                        <div
                            className={cw(styles.myResults)}
                            onClick={() => {
                                setSheetViewData(
                                    talliedResults.riderOfTheDay.id
                                );
                                setSheetViewType(ResultSheetViewType.RIDER);
                            }}
                        >
                            <div>
                                <h2 className={cw(typography.titleReduced)}>
                                    Rider of the Day
                                </h2>
                                <p className={cw(typography.bodyReduced)}>
                                    {talliedResults.riderOfTheDay.name}
                                </p>
                                <p className={cw(typography.caption)}>
                                    {riderResultsToHighlightString(
                                        talliedResults.riderOfTheDay
                                    )}
                                </p>
                            </div>
                            <ForwardChevronIcon />
                        </div>
                        <HR />
                        <div className={cw(styles.generalClassification)}>
                            <h2 className={cw(typography.titleReduced)}>
                                General Classification
                            </h2>
                            <GeneralClassificationList
                                riders={talliedResults.generalClassification}
                                limit={10}
                                onItemClick={(athleteId) => {
                                    setSheetViewData(athleteId);
                                    setSheetViewType(ResultSheetViewType.RIDER);
                                }}
                            />
                            <div
                                className={typography.bodyReduced}
                                style={{ textAlign: "center", margin: 15 }}
                                onClick={() => {
                                    setSheetViewType(ResultSheetViewType.GC);
                                }}
                            >
                                See All
                            </div>
                        </div>
                    </div>
                </div>

                <Controls style={{ top: 10, right: 10 }}>
                    <UnitSwitcher />
                </Controls>

                <ResultsSheet
                    type={sheetViewType}
                    typeData={sheetViewData}
                    fullHeight={sheetFullHeight}
                    onHide={() => setSheetViewType(ResultSheetViewType.EMPTY)}
                ></ResultsSheet>
            </div>
        </div>
    );
};
