import React, { useEffect, useState } from "react";
import cw from "classnames";
import Link from "next/link";
import { useResultsData } from "../../data/useResultsData";
import { SizeClass, useHorizontalSizeClass } from "../../utils/useSizeClass";

import styles from "./ResultsView.module.css";
import typography from "../../styles/Typography.module.css";
import errorStyles from "../../styles/ErrorMessage.module.css";
import loadingStyles from "../../styles/LoadingMessage.module.css";
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
import { SegmentItem } from "../SegmentItem/SegmentItem";

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

    console.log(talliedData);

    return (
        <div>
            <div
                className={cw(styles.titleLockup)}
                style={{
                    backgroundImage: `url(${data.club.cover_photo})`,
                    backgroundSize: "cover",
                }}
            >
                <h1 className={cw(typography.title)}>{data.title}</h1>
                <Link
                    href={`/route?r=${
                        data.route.id_str
                    }&s=${data.segmentsInOrder.join(",")}`}
                >
                    <a className={cw(typography.link, styles.routeLink)}>
                        View Route
                    </a>
                </Link>
                <Link href={`https://strava.com/clubs/${data.club.url}`}>
                    <a className={cw(typography.link, styles.clubLink)}>
                        {`View ${data.club.name} on Strava`}
                    </a>
                </Link>
            </div>
            <div className={cw(styles.statsContainer)}>
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
                    />
                </div>
                <HR />
                <div className={styles.metadataContainer}>
                    <SheetMetadata
                        num={talliedData.stats.numberOfRiders}
                        unit={""}
                        description={"Riders"}
                    />
                    <SheetMetadata
                        num={talliedData.stats.numberOfPRs}
                        unit={""}
                        description={"PRs"}
                    />
                    <SheetMetadata
                        num={talliedData.stats.numberOfXOMs}
                        unit={""}
                        description={"XOMs"}
                    />
                    <SheetMetadata
                        num={talliedData.stats.numberOfXOMs}
                        unit={""}
                        description={"Club XOMs"}
                    />
                </div>
                <HR />
                <ul className={cw(typography.bodySmall, styles.routeStats)}>
                    <li>
                        Longest Segment:{" "}
                        <strong>{talliedData.stats.longestSegment[0]}</strong> (
                        {distanceStr(
                            units,
                            talliedData.stats.longestSegment[1],
                            2
                        )}{" "}
                        {unitsStr(units, "km")})
                    </li>
                    <li>
                        Steepest Segment:{" "}
                        <strong>{talliedData.stats.steepestSegment[0]}</strong>{" "}
                        ({talliedData.stats.steepestSegment[1]}%)
                    </li>
                    <li>
                        Most PRed Segment:{" "}
                        <strong>
                            {talliedData.stats.segmentWithMostPRs[0]}
                        </strong>{" "}
                        ({talliedData.stats.segmentWithMostPRs[1]})
                    </li>
                </ul>
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
                <div>
                    <h2 className={cw(typography.titleReduced)}>
                        General Classification
                    </h2>
                    <h3 className={cw(typography.subTitle)}>Women</h3>
                    {talliedData.generalClassification.women.length && (
                        <table>
                            {talliedData.generalClassification.women.map(
                                (item: GCRider, i: number) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{item.name}</td>
                                        <td>
                                            {secondsToMinutes(
                                                item.timeInSeconds
                                            )}
                                        </td>
                                    </tr>
                                )
                            )}
                        </table>
                    )}

                    <h3 className={cw(typography.subTitle)}>Men</h3>
                    {talliedData.generalClassification.men.length && (
                        <table>
                            {talliedData.generalClassification.men.map(
                                (item: GCRider, i: number) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{item.name}</td>
                                        <td>
                                            {secondsToMinutes(
                                                item.timeInSeconds
                                            )}
                                        </td>
                                    </tr>
                                )
                            )}
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};
