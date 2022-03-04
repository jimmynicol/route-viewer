import React from "react";
import cw from "classnames";
import Image from "next/image";

import typography from "../../styles/Typography.module.css";
import { ForwardChevronIcon } from "../Icons/ForwardChevronIcon";
import { useResultsDataContext } from "../../contexts/ResultsData";
import { riderResultsToHighlightString } from "../../data/resultsConverter";
import {
    AthleteDataState,
    useAthleteDataContext,
} from "../../contexts/AthleteData";
import { ProfileImage } from "../Misc/ProfileImage";

export const MyResults: React.ComponentType<{
    classNames?: string[];
}> = ({ classNames }) => {
    const { athleteDataState, athleteData } = useAthleteDataContext();
    const { statsByRider } = useResultsDataContext();

    if (athleteDataState === AthleteDataState.LOADING) {
        return (
            <div className={cw(...(classNames || []))}>
                <p>Loading your data...</p>
            </div>
        );
    }

    if (athleteDataState === AthleteDataState.ERROR) {
        return (
            <div className={cw(...(classNames || []))}>
                <p>Unable to load your data, please try again soon!</p>
            </div>
        );
    }

    if (!athleteData) return <div></div>;

    const caption = riderResultsToHighlightString(statsByRider(athleteData.id));

    return (
        <div className={cw(...(classNames || []))}>
            <div>
                <ProfileImage
                    src={athleteData.profile}
                    height={40}
                    width={40}
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
