import React from "react";
import cw from "classnames";
import Link from "next/link";

import styles from "./ResultsView.module.css";
import typography from "../../styles/Typography.module.css";
import { RideEfforts } from "../../data/stravaDataTypes";

export const TitleLockup: React.ComponentType<{ data: RideEfforts }> = ({
    data,
}) => {
    return (
        <div
            className={cw(styles.titleLockup)}
            style={{
                backgroundImage: `url(${data.club.cover_photo})`,
                backgroundSize: "cover",
            }}
        >
            <h1 className={cw(typography.title)}>{data.title}</h1>
            <Link
                href={`/route?r=${
                    data.route.id_str
                }&s=${data.segmentsInOrder.join(",")}`}
            >
                <a className={cw(typography.link, styles.routeLink)}>
                    View Route
                </a>
            </Link>
            <Link href={`https://strava.com/clubs/${data.club.url}`}>
                <a className={cw(typography.link, styles.clubLink)}>
                    {`View ${data.club.name} on Strava`}
                </a>
            </Link>
        </div>
    );
};
