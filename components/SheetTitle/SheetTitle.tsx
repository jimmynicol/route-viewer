import React from "react";
import styles from "./SheetTitle.module.css";

export const SheetTitle: React.ComponentType<{
    title: string | undefined;
    link: string | undefined;
}> = ({ title, link }) => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{title}</h1>
            <a className={styles.link} href={link}>
                View on Strava
            </a>
        </div>
    );
};
