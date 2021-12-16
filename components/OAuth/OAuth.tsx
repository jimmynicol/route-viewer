import React from "react";
import { SizeClass, useHorizontalSizeClass } from "../../utils/useSizeClass";

import styles from "./OAuth.module.css";

function redirectToStrava() {
    const url = new URL("https://www.strava.com/oauth/authorize");
    url.searchParams.set("client_id", "28075");
    url.searchParams.set("response_type", "code");
    url.searchParams.set("approval_prompt", "auto");
    url.searchParams.set("scope", "read");
    url.searchParams.set("redirect_uri", window.location.href);

    window.location.href = url.toString();
}

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
                <h3 className={styles.oauthTitle}>
                    Sign In with Strava to view this route and its segments.
                </h3>
                <button
                    className={styles.redirectButton}
                    onClick={redirectToStrava}
                >
                    <svg
                        className={styles.redirectButtonSVG}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                    >
                        <path d="M226.8,31L93.8,287.6h78.4l54.7-102l54.2,102h77.8L226.8,31z M358.8,287.6l-38.6,77.5L281,287.6h-59.4L320.2,481l98-193.4 H358.8z" />
                    </svg>
                    <span>Sign In</span>
                </button>
                <p className={styles.oauthDescription}>
                    We do not need any of your private data. Connecting with
                    Strava is the only way to show route information.
                </p>
            </div>
        </div>
    );
};
