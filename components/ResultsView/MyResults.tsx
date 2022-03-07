import React from "react";
import cw from "classnames";

import { ForwardChevronIcon } from "../Icons/ForwardChevronIcon";
import { useResultsDataContext } from "../../contexts/ResultsData";
import { riderResultsToHighlightString } from "../../data/resultsConverter";
import {
    AthleteDataState,
    useAthleteDataContext,
} from "../../contexts/AthleteData";
import { ProfileImage } from "../Misc/ProfileImage";

import typography from "../../styles/Typography.module.css";

export const MyResults: React.ComponentType<
    React.HTMLAttributes<HTMLDivElement>
> = ({ ...props }) => {
    const { athleteDataState, athleteData } = useAthleteDataContext();
    const { statsByRider } = useResultsDataContext();

    if (athleteDataState === AthleteDataState.LOADING) {
        return (
            <div {...props}>
                <p>Loading your data...</p>
            </div>
        );
    }

    if (athleteDataState === AthleteDataState.ERROR) {
        return (
            <div {...props}>
                <p>Unable to load your data, please try again soon!</p>
            </div>
        );
    }

    if (!athleteData) return <div></div>;

    const caption = riderResultsToHighlightString(statsByRider(athleteData.id));

    return (
        <div {...props}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 15,
                }}
            >
                <ProfileImage
                    src={athleteData.profile}
                    height={46}
                    width={46}
                ></ProfileImage>
                <div>
                    <h2 className={cw(typography.titleReduced)}>My Results</h2>
                    <p className={cw(typography.caption)}>{caption}</p>
                </div>
            </div>
            <ForwardChevronIcon />
        </div>
    );
};
