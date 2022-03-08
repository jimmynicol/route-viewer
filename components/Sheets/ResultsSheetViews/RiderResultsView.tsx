import React, { useEffect, useRef, useState } from "react";
import cw from "classnames";

import { useAthleteDataContext } from "../../../contexts/AthleteData";
import {
    athleteLinks,
    useResultsDataContext,
} from "../../../contexts/ResultsData";
import {
    SegmentAchievement,
    SummarySegment,
} from "../../../data/stravaDataTypes";
import { secondsToMinutes } from "../../../utils/unitConversions";
import { AchievementIcon } from "../../Icons/AchievementIcon";
import { HR } from "../../Misc/HR";
import { MetadataContainer } from "../../Misc/MetadataContainer";
import { ProfileImage } from "../../Misc/ProfileImage";
import { ListItem } from "../../Misc/ListItem";
import { SheetMetadata } from "../../Misc/SheetMetadata";

import typography from "../../../styles/Typography.module.css";
import styles from "./RiderResultsView.module.css";
import { measurePrevSiblingsHeight } from "../../../utils/domUtils";

export const RiderResultsView: React.ComponentType<{
    athleteId: string;
    onSegmentClick?: (segment: SummarySegment) => void;
}> = ({ athleteId, onSegmentClick }) => {
    const { athleteData } = useAthleteDataContext();
    const { results, talliedResults, effortsByRider } = useResultsDataContext();
    const segmentsRef = useRef<HTMLDivElement>(null);
    const [segmentsHeight, setSegmentsHeight] = useState(0);

    const isLoggedInUser = athleteData.id === athleteId;
    const efforts = effortsByRider(athleteId);
    const firstEffort = efforts[results.segmentsInOrder[0]];
    const riderName = firstEffort.athlete_name;
    const link = `https://www.strava.com/activities/${firstEffort.activity_id}`;

    const overallTimeInSeconds = results.segmentsInOrder.reduce(
        (previousValue: number, currentValue: string) => {
            const effort = efforts[currentValue];
            return effort ? previousValue + effort.elapsed_time : previousValue;
        },
        0
    );

    useEffect(() => {
        const segmentsEl = segmentsRef.current;
        const componentEl =
            segmentsEl?.parentElement?.parentElement?.parentElement;
        if (!segmentsEl || !componentEl) return;

        const componentHeight = componentEl.getBoundingClientRect().height;
        const siblingsHeight = measurePrevSiblingsHeight(segmentsEl);

        setSegmentsHeight(componentHeight - siblingsHeight);
    }, [athleteId, segmentsRef, setSegmentsHeight]);

    const metadata = () => {
        const [athleteLink, proLink] = athleteLinks(athleteId);
        const rideStats =
            talliedResults.riders[athleteLink] ||
            talliedResults.riders[proLink];

        if (
            rideStats.prs === 0 &&
            rideStats.xoms === 0 &&
            rideStats.clubXOMs === 0 &&
            rideStats.top10s === 0
        ) {
            return <div></div>;
        }

        return (
            <MetadataContainer>
                <SheetMetadata
                    num={rideStats.prs}
                    unit={""}
                    description={"PRs"}
                />
                <SheetMetadata
                    num={rideStats.xoms}
                    unit={""}
                    description={"XOMs"}
                />
                <SheetMetadata
                    num={rideStats.clubXOMs}
                    unit={""}
                    description={"ClubXOMs"}
                />
                <SheetMetadata
                    num={rideStats.top10s}
                    unit={""}
                    description={"Cups"}
                />
            </MetadataContainer>
        );
    };

    const segments = Object.keys(efforts).map((segmentId, index) => {
        const segment = results.segments[segmentId].segment;
        const effort = efforts[segmentId];
        const hasAchievement = effort.achievement !== SegmentAchievement.NONE;

        return (
            <ListItem
                key={index}
                index={index + 1}
                title={segment.name}
                onClick={() =>
                    onSegmentClick ? onSegmentClick(segment) : null
                }
            >
                {hasAchievement && (
                    <AchievementIcon
                        achievement={effort.achievement}
                    ></AchievementIcon>
                )}
                <span className={typography.semanticallyReduced}>
                    {secondsToMinutes(effort.elapsed_time)}
                    {effort.average_power > 0 && (
                        <span>{` @ ${effort.average_power}W`}</span>
                    )}
                </span>
                <span className={styles.rank}>{effort.rank}</span>
            </ListItem>
        );
    });

    return (
        <div className={styles.riderResults}>
            <div className={styles.titleLockup}>
                {isLoggedInUser && (
                    <div className={styles.loggedInUser}>
                        <ProfileImage
                            src={athleteData.profile}
                            height={46}
                            width={46}
                        ></ProfileImage>
                        <div>
                            <h2 className={cw(typography.titleReduced)}>
                                My Results
                            </h2>
                            <p className={cw(typography.caption)}>
                                {athleteData.firstname} {athleteData.lastname}
                            </p>
                        </div>
                    </div>
                )}
                {!isLoggedInUser && (
                    <div className={styles.riderName}>
                        <h2 className={cw(typography.titleReduced)}>
                            {riderName}
                        </h2>
                    </div>
                )}
                <a
                    className={cw(typography.link)}
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                >
                    View on Strava
                </a>
            </div>
            <HR />
            <div>{metadata()}</div>
            <HR />
            <div className={cw(styles.overallTime, typography.subTitle)}>
                Overall Time:{" "}
                <span>{secondsToMinutes(overallTimeInSeconds)}</span>
            </div>
            <HR />
            <div
                ref={segmentsRef}
                style={{
                    height: segmentsHeight,
                    overflowY: "scroll",
                    paddingBlockEnd: 30,
                }}
            >
                <div>{segments}</div>
            </div>
        </div>
    );
};
