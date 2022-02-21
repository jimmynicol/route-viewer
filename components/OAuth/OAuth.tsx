import React from "react";
import cw from "classnames";

import { SizeClass, useHorizontalSizeClass } from "../../utils/useSizeClass";
import { StravaSignInButton } from "./StravaSignInButton";

import styles from "./OAuth.module.css";
import typography from "../../styles/Typography.module.css";

export const OAuth: React.ComponentType = () => {
    const sizeClass = useHorizontalSizeClass();

    return (
        <div className={styles.oauthContainer}>
            <div
                className={
                    sizeClass === SizeClass.COMPACT
                        ? styles.compact
                        : styles.regular
                }
            >
                <h2 className={cw(styles.oauthTitle, typography.titleReduced)}>
                    Sign In with Strava to view this route and its segments.
                </h2>
                <StravaSignInButton />
                <p className={cw(styles.oauthDescription, typography.caption)}>
                    We do not need any of your private data. Connecting with
                    Strava is the only way to show route information.
                </p>
            </div>
        </div>
    );
};
