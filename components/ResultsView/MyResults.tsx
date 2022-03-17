import React from "react";
import cw from "classnames";

import { ForwardChevronIcon } from "../Icons/ForwardChevronIcon";
import { useResultsDataContext } from "../../contexts/ResultsData";
import { riderResultsToHighlightString } from "../../data/resultsConverter";
import { ProfileImage } from "../Misc/ProfileImage";
import { useAthleteWithToken } from "../../data/useStravaData";

import typography from "../../styles/Typography.module.css";

export const MyResults: React.ComponentType<
    {
        onItemClick: (athleteId: string) => void;
    } & React.HTMLAttributes<HTMLDivElement>
> = ({ onItemClick, ...props }) => {
    const { talliedResults, statsByRider } = useResultsDataContext();
    const { isLoading, isError, data } = useAthleteWithToken();

    if (isLoading) {
        return (
            <div className={typography.body}>
                <p>Loading your data...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className={typography.body}>
                <p>Unable to load your data, please try again soon!</p>
            </div>
        );
    }

    if (!data) return <div></div>;

    const caption = riderResultsToHighlightString(statsByRider(data.id));

    return (
        <div {...props} onClick={() => onItemClick(data.id)}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 15,
                }}
            >
                <ProfileImage
                    src={data.profile}
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
