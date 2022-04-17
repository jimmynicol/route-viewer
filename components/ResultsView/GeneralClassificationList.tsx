import React, { useState } from "react";
import cw from "classnames";

import { GeneralClassification } from "../../data/resultsConverter";
import { secondsToMinutes } from "../../utils/unitConversions";
import { SegmentedControl } from "../Misc/SegmentedControl";
import { Sex } from "../../data/stravaDataTypes";

import typography from "../../styles/Typography.module.css";
import styles from "./GeneralClassificationList.module.css";

export const GeneralClassificationList: React.ComponentType<
    {
        riders: GeneralClassification;
        limit?: number;
        onItemClick?: (athleteId: string) => void;
        onSeeAll?: (genderToShow: Sex) => void;
    } & React.HTMLAttributes<HTMLDivElement>
> = ({ riders, limit = 10, onItemClick, onSeeAll, ...props }) => {
    const [genderToShow, setGenderToShow] = useState(0);

    const header = (
        <SegmentedControl
            labels={["Women", "Men"]}
            style={{ marginBlock: 15 }}
            onValueChanged={(value) => setGenderToShow(value.index)}
        ></SegmentedControl>
    );

    const listItems = riders[genderToShow ? "men" : "women"]
        .slice(0, limit)
        .map((rider, i) => (
            <div
                key={i}
                className={cw(styles.gcListItem, props.className)}
                onClick={() =>
                    onItemClick ? onItemClick(rider.athleteId) : null
                }
            >
                <p className={cw(styles.index, typography.bodyReduced)}>
                    {i + 1}
                </p>
                <h3 className={cw(styles.title, typography.subTitle)}>
                    {rider.name}
                </h3>
                <p className={cw(styles.time, typography.bodyReduced)}>
                    {secondsToMinutes(rider.timeInSeconds)}
                </p>
            </div>
        ));

    return (
        <div {...props}>
            {header}
            <div>{listItems}</div>
            <div
                className={typography.bodyReduced}
                style={{ textAlign: "center", margin: 15 }}
                onClick={() =>
                    onSeeAll
                        ? onSeeAll(genderToShow ? Sex.Male : Sex.Female)
                        : null
                }
            >
                See All
            </div>
        </div>
    );
};
