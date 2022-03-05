import React, { useEffect, useState } from "react";
import cw from "classnames";

import { TalliedRideEfforts } from "../../data/resultsConverter";
import { DetailedAthlete, RideEfforts } from "../../data/stravaDataTypes";
import { ProfileImage } from "../Misc/ProfileImage";
import { Sheet, SheetViewState } from "./Sheet";

import typography from "../../styles/Typography.module.css";
import { useAthleteDataContext } from "../../contexts/AthleteData";
import {
    athleteLinks,
    useResultsDataContext,
} from "../../contexts/ResultsData";
import { ForwardChevronIcon } from "../Icons/ForwardChevronIcon";
import { secondsToMinutes } from "../../utils/unitConversions";
import { SheetMetadata } from "../SheetMetadata/SheetMetadata";

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
    results: RideEfforts;
    talliedResults: TalliedRideEfforts;
    athleteData: DetailedAthlete;
    onHide: () => void;
    fullHeight?: number;
    defaultHeight?: number;
}> = ({
    type,
    results,
    talliedResults,
    athleteData,
    onHide,
    defaultHeight = -50,
    fullHeight = 500,
}) => {
    const [sheetViewState, setSheetViewState] = useState<SheetViewState>(
        SheetViewState.HIDE
    );

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

    let content;

    switch (type) {
        case ResultSheetViewType.MY_RESULTS:
            content = <RiderResults athleteId={athleteData.id}></RiderResults>;
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
            viewState={sheetViewState}
            defaultHeight={defaultHeight}
            fullHeight={fullHeight}
            onChangeViewState={setSheetViewState}
        >
            {content}
        </Sheet>
    );
};

export const RiderResults: React.ComponentType<{
    athleteId: string;
}> = ({ athleteId }) => {
    const { athleteData } = useAthleteDataContext();
    const { results, talliedResults, effortsByRider } = useResultsDataContext();

    const isLoggedInUser = athleteData.id === athleteId;
    const efforts = effortsByRider(athleteId);
    const link = `https://www.strava.com/activities/${
        efforts[results.segmentsInOrder[0]].activity_id
    }`;

    const metadata = () => {
        const [athleteLink, proLink] = athleteLinks(athleteId);
        const rideStats =
            talliedResults.riders[athleteLink] ||
            talliedResults.riders[proLink];
        return (
            <div>
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
            </div>
        );
    };

    const segments = results.segmentsInOrder.map((segmentId, index) => {
        const segment = results.segments[segmentId].segment;
        const effort = efforts[segmentId];

        return (
            <div key={index}>
                <p className={cw(typography.bodyReduced)}>{index + 1}</p>
                <h3 className={cw(typography.subTitle)}>{segment.name}</h3>
                <p className={cw(typography.caption)}>
                    <span>
                        {secondsToMinutes(effort.elapsed_time)} @{" "}
                        {effort.average_power}W
                    </span>
                </p>
                <ForwardChevronIcon style={{ height: 15, width: 15 }} />
            </div>
        );
    });

    return (
        <div>
            <div>
                {isLoggedInUser && (
                    <div>
                        <ProfileImage
                            src={athleteData.profile}
                            height={46}
                            width={46}
                        ></ProfileImage>
                        <h2 className={cw(typography.titleReduced)}>
                            My Results
                        </h2>
                    </div>
                )}
                <a
                    className={cw(typography.link)}
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                >
                    View Ride on Strava
                </a>
            </div>
            <div>{metadata()}</div>
            <div>{segments}</div>
        </div>
    );
};
