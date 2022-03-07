import React from "react";
import cw from "classnames";

import styles from "./StravaSignInButton.module.css";

const STRAVA_CLIENT_ID = process.env.CLIENT_ID || "";

function redirectToStrava() {
    const url = new URL("https://www.strava.com/oauth/authorize");
    url.searchParams.set("client_id", STRAVA_CLIENT_ID);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("approval_prompt", "auto");
    url.searchParams.set("scope", "read");
    url.searchParams.set("redirect_uri", window.location.href);

    window.location.href = url.toString();
}

export const StravaSignInButton: React.ComponentType<{
    classNames?: string[];
}> = ({ classNames }) => {
    const _classNames: string[] = [styles.redirectButton];
    if (classNames && classNames.length > 0) {
        _classNames.push(...classNames);
    }

    return (
        <button className={cw(_classNames)} onClick={redirectToStrava}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M226.8,31L93.8,287.6h78.4l54.7-102l54.2,102h77.8L226.8,31z M358.8,287.6l-38.6,77.5L281,287.6h-59.4L320.2,481l98-193.4 H358.8z" />
            </svg>
            <span>Sign In</span>
        </button>
    );
};
