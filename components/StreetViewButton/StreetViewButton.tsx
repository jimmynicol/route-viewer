import React from "react";
import cw from "classnames";

import { StartIcon } from "../Icons/StartIcon";
import { StopIcon } from "../Icons/StopIcon";

import styles from "./StreetViewButton.module.css";
import typography from "../../styles/Typography.module.css";

export enum StreetViewButtonMode {
    START = "start",
    STOP = "stop",
}

export const StreetViewButton: React.ComponentType<{
    mode: StreetViewButtonMode;
    onClick: () => void;
}> = ({ mode, onClick }) => {
    const label =
        mode === StreetViewButtonMode.START ? "View Start" : "View End";
    const icon =
        mode === StreetViewButtonMode.START ? (
            <StartIcon className={styles.startSVG} />
        ) : (
            <StopIcon className={styles.stopSVG} />
        );

    return (
        <button
            className={cw(styles.streetViewButton, typography.button)}
            onClick={onClick}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
};
