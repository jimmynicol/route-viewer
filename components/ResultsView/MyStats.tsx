import React from "react";
import cw from "classnames";
import { AuthState, useAuthStateContext } from "../../contexts/AuthState";

import typography from "../../styles/Typography.module.css";
import { ForwardChevronIcon } from "../Icons/ForwardChevronIcon";
import { StravaSignInButton } from "../OAuth/StravaSignInButton";

export const MyStats: React.ComponentType<{
    classNames?: string[];
}> = ({ classNames }) => {
    const { authState } = useAuthStateContext();

    const caption =
        authState === AuthState.VALID
            ? ""
            : "Log into Strava to see your results.";

    const btn =
        authState === AuthState.VALID ? (
            <ForwardChevronIcon />
        ) : (
            <StravaSignInButton />
        );

    return (
        <div className={cw(...(classNames || []))}>
            <div>
                <h2 className={cw(typography.titleReduced)}>My Results</h2>
                <p className={cw(typography.caption)}>{caption}</p>
            </div>
            {btn}
        </div>
    );
};
