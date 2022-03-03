import React from "react";
import cw from "classnames";

import typography from "../../styles/Typography.module.css";
import { ForwardChevronIcon } from "../Icons/ForwardChevronIcon";
import { useAthlete } from "../../data/useStravaData";
import { useAPITokenContext } from "../../contexts/APIToken";
import { useResultsData } from "../../data/useResultsData";
import { useResultsDataContext } from "../../contexts/ResultsData";
import { riderResultsToHighlightString } from "../../data/resultsConverter";

export const MyResults: React.ComponentType<{
    classNames?: string[];
}> = ({ classNames }) => {
    const {
        tokenResponse: { access_token },
    } = useAPITokenContext();
    const { isLoading, isError, data } = useAthlete(access_token);
    const { statsByRider } = useResultsDataContext();

    if (isLoading) {
        return (
            <div className={cw(...(classNames || []))}>
                <p>Loading your data...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className={cw(...(classNames || []))}>
                <p>Unable to load your data, please try again soon!</p>
            </div>
        );
    }

    if (!data) return <div></div>;

    const caption = riderResultsToHighlightString(statsByRider(data.id));

    return (
        <div className={cw(...(classNames || []))}>
            <div>
                <h2 className={cw(typography.titleReduced)}>My Results</h2>
                <p className={cw(typography.caption)}>{caption}</p>
            </div>
            <ForwardChevronIcon />
        </div>
    );
};
