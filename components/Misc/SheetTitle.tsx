import React from "react";
import cw from "classnames";

import styles from "./SheetTitle.module.css";
import typography from "../../styles/Typography.module.css";

export const SheetTitle: React.ComponentType<{
    title: string | undefined;
    link: string | undefined;
}> = ({ title, link }) => {
    return (
        <div className={styles.container}>
            <h1 className={cw(styles.title, typography.title)}>{title}</h1>
            <a
                className={cw(styles.link, typography.link)}
                href={link}
                target="_blank"
                rel="noreferrer"
            >
                View on Strava
            </a>
        </div>
    );
};
