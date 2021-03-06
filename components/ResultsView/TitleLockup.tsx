import React from "react";
import cw from "classnames";
import Link from "next/link";

import { RideEfforts } from "../../data/stravaDataTypes";
import { SizeClass, useHorizontalSizeClass } from "../../utils/useSizeClass";

import styles from "./ResultsView.module.css";
import typography from "../../styles/Typography.module.css";

export const TitleLockup = React.forwardRef<
    HTMLDivElement,
    { data: RideEfforts }
>(function TitleLockup({ data }, ref) {
    const sizeClass = useHorizontalSizeClass();

    return (
        <div
            ref={ref}
            className={cw(styles.titleLockup)}
            style={{
                backgroundImage: `url(${data.club.cover_photo})`,
                backgroundSize: "cover",
            }}
        >
            <h1 className={cw(typography.title)}>{data.title}</h1>
            {sizeClass === SizeClass.COMPACT && (
                <Link
                    href={`/route?r=${
                        data.route.id_str
                    }&s=${data.segmentsInOrder.join(",")}`}
                >
                    <a className={cw(typography.link, styles.routeLink)}>
                        View Route
                    </a>
                </Link>
            )}
            <Link href={`https://strava.com/clubs/${data.club.url}`}>
                <a className={cw(typography.link, styles.clubLink)}>
                    {`View ${data.club.name} on Strava`}
                </a>
            </Link>
        </div>
    );
});
