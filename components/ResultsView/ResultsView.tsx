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
import { EffortStats } from "./EffortStats";
import { GeneralClassificationTable } from "./GeneralClassificationTable";
import { SegmentStats } from "./SegmentStats";
import { SegmentedControl } from "../Misc/SegmentedControl";
import {
    ResultsDataState,
    useResultsDataContext,
} from "../../contexts/ResultsData";
import { isEmpty } from "../../utils/isEmpty";
import { MyResults } from "./MyResults";

import styles from "./ResultsView.module.css";
import typography from "../../styles/Typography.module.css";
import errorStyles from "../../styles/ErrorMessage.module.css";
import loadingStyles from "../../styles/LoadingMessage.module.css";
import { ResultSheetViewType, ResultsSheet } from "../Sheets/ResultsSheet";
import { useAthleteDataContext } from "../../contexts/AthleteData";

export const ResultsView: React.ComponentType = () => {
    const sizeClass = useHorizontalSizeClass();
    const { authState } = useAuthStateContext();
    const { resultsDataState, results, talliedResults } =
        useResultsDataContext();
    const { athleteData } = useAthleteDataContext();

    const viewRef = useRef<HTMLDivElement>(null);
    const titleLockupRef = useRef<HTMLDivElement>(null);

    const [showGC, setShowGC] = useState<number>(0);
    const [wrapperHeight, setWrapperHeight] = useState<number>(500);
    const [sheetFullHeight, setSheetFullHeight] = useState<number>(0);
    const [sheetViewType, setSheetViewType] = useState<ResultSheetViewType>(
        ResultSheetViewType.EMPTY
    );

    useEffect(() => {
        const viewElement = viewRef.current;
        const titleLockupElement = titleLockupRef.current;

        if (!viewElement || !titleLockupElement) return;

        const viewElementHeight = viewElement.getBoundingClientRect().height;

        setWrapperHeight(
            viewElementHeight -
                titleLockupElement.getBoundingClientRect().height
        );
        setSheetFullHeight(viewElementHeight - 30);
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

    console.log(results);
    console.log(talliedResults);

    return (
        <div ref={viewRef} className={cw(styles.resultsView)}>
            <TitleLockup ref={titleLockupRef} data={results} />
            <div
                className={cw(styles.scrollWrapper)}
                style={{ height: wrapperHeight }}
            >
                <div className={cw(styles.statsContainer)}>
                    <RideStats
                        classNames={[styles.metadataContainer]}
                        distance={results.route.distance}
                        elevationGain={results.route.elevation_gain}
                        numberOfSegments={results.segmentsInOrder.length}
                        onSegmentsClick={() =>
                            setSheetViewType(ResultSheetViewType.SEGMENTS)
                        }
                    />
                    <HR />
                    <EffortStats
                        classNames={[styles.metadataContainer]}
                        riders={talliedResults.stats.numberOfRiders}
                        prs={talliedResults.stats.numberOfPRs}
                        xoms={talliedResults.stats.numberOfXOMs}
                        clubXoms={talliedResults.stats.numberOfXOMs}
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
                            onClick={() =>
                                setSheetViewType(ResultSheetViewType.MY_RESULTS)
                            }
                        />
                    )}
                    <HR />
                    <div className={cw(styles.myResults)}>
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
                        <SegmentedControl
                            labels={["Women", "Men"]}
                            onValueChanged={(value) => setShowGC(value.index)}
                            classNames={[styles.segmentedControl]}
                        ></SegmentedControl>

                        {talliedResults.generalClassification.women.length >
                            0 &&
                            showGC === 0 && (
                                <GeneralClassificationTable
                                    label={"Women"}
                                    riders={
                                        talliedResults.generalClassification
                                            .women
                                    }
                                />
                            )}
                        {talliedResults.generalClassification.men.length > 0 &&
                            showGC === 1 && (
                                <GeneralClassificationTable
                                    label={"Men"}
                                    riders={
                                        talliedResults.generalClassification.men
                                    }
                                />
                            )}
                    </div>
                </div>
            </div>

            <ResultsSheet
                type={sheetViewType}
                results={results}
                talliedResults={talliedResults}
                athleteData={athleteData}
                fullHeight={sheetFullHeight}
                onHide={() => setSheetViewType(ResultSheetViewType.EMPTY)}
            ></ResultsSheet>
        </div>
    );
};
