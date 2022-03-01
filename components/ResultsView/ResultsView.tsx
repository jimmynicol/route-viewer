import React, { useEffect, useState } from "react";
import cw from "classnames";
import Link from "next/link";
import { useResultsData } from "../../data/useResultsData";
import { SizeClass, useHorizontalSizeClass } from "../../utils/useSizeClass";

import {
    GCRider,
    resultsConverter,
    riderResultsToHighlightString,
    TalliedRideEfforts,
} from "../../data/resultsConverter";
import {
    distanceStr,
    elevationStr,
    secondsToMinutes,
    unitsStr,
} from "../../utils/unitConversions";
import { useUnitsContext } from "../../contexts/Units";
import { SheetMetadata } from "../SheetMetadata/SheetMetadata";
import { HR } from "../Misc/HR";
import { StravaSignInButton } from "../OAuth/StravaSignInButton";
import { AuthState, useAuthStateContext } from "../../contexts/AuthState";
import { ForwardChevronIcon } from "../Icons/ForwardChevronIcon";
import { TitleLockup } from "./TitleLockup";
import { RideStats } from "./RideStats";
import { EffortStats } from "./EffortStats";

import styles from "./ResultsView.module.css";
import typography from "../../styles/Typography.module.css";
import errorStyles from "../../styles/ErrorMessage.module.css";
import loadingStyles from "../../styles/LoadingMessage.module.css";
import { GeneralClassificationTable } from "./GeneralClassificationTable";
import { SegmentStats } from "./SegmentStats";

export const ResultsView: React.ComponentType<{
    resultsName: string;
}> = ({ resultsName }) => {
    const { units } = useUnitsContext();
    const { authState } = useAuthStateContext();
    const sizeClass = useHorizontalSizeClass();
    const { isLoading, isError, data } = useResultsData(resultsName);
    const [talliedData, setTalliedData] = useState<TalliedRideEfforts>();

    useEffect(() => {
        if (!data) return;
        setTalliedData(resultsConverter(data));
    }, [data]);

    if (isLoading) {
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

    if (isError) {
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

    if (!data || !talliedData) {
        return <div></div>;
    }

    const distance = distanceStr(units, data.route.distance, 2);
    const elevation = elevationStr(units, data.route.elevation_gain, 0);
    const numSegments = data.segmentsInOrder.length;

    return (
        <div className={cw(styles.resultsView)}>
            <TitleLockup data={data} />
            <div className={cw(styles.statsContainer)}>
                <RideStats
                    classNames={[styles.metadataContainer]}
                    distance={data.route.distance}
                    elevationGain={data.route.elevation_gain}
                    numberOfSegments={data.segmentsInOrder.length}
                />
                <HR />
                <EffortStats
                    classNames={[styles.metadataContainer]}
                    riders={talliedData.stats.numberOfRiders}
                    prs={talliedData.stats.numberOfPRs}
                    xoms={talliedData.stats.numberOfXOMs}
                    clubXoms={talliedData.stats.numberOfXOMs}
                />
                <HR />
                <SegmentStats
                    classNames={[styles.routeStats]}
                    talliedData={talliedData}
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
                    <div className={cw(styles.myResults)}>
                        <div>
                            <h2 className={cw(typography.titleReduced)}>
                                My Results
                            </h2>
                            <p className={cw(typography.caption)}>
                                7 PRs, 2 XOMs.
                            </p>
                        </div>
                        <ForwardChevronIcon />
                    </div>
                )}
                <HR />
                <div className={cw(styles.myResults)}>
                    <div>
                        <h2 className={cw(typography.titleReduced)}>
                            Rider of the Day
                        </h2>
                        <p className={cw(typography.bodyReduced)}>
                            {talliedData.riderOfTheDay.name}
                        </p>
                        <p className={cw(typography.caption)}>
                            {riderResultsToHighlightString(
                                talliedData.riderOfTheDay
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
                    {talliedData.generalClassification.women.length > 0 && (
                        <GeneralClassificationTable
                            label={"Women"}
                            riders={talliedData.generalClassification.women}
                        />
                    )}
                    {talliedData.generalClassification.men.length > 0 && (
                        <GeneralClassificationTable
                            label={"Men"}
                            riders={talliedData.generalClassification.men}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
