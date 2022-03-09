import React, { useState } from "react";

import { ScrollingListView } from "../../Misc/ScrollingListView";
import { HR } from "../../Misc/HR";
import { SegmentedControl } from "../../Misc/SegmentedControl";

import typography from "../../../styles/Typography.module.css";
import { useResultsDataContext } from "../../../contexts/ResultsData";
import { secondsToMinutes } from "../../../utils/unitConversions";
import { ListItem } from "../../Misc/ListItem";

export const GCView: React.ComponentType<
    {
        onItemClick?: (athleteId: string) => void;
    } & React.HTMLAttributes<HTMLDivElement>
> = ({ onItemClick, ...props }) => {
    const {
        talliedResults: { generalClassification },
    } = useResultsDataContext();
    const [genderToShow, setGenderToShow] = useState(0);

    const header = (
        <div>
            <h2
                className={typography.titleReduced}
                style={{ marginBlockStart: 0 }}
            >
                General Classification
            </h2>
            <HR />
            <SegmentedControl
                labels={["Women", "Men"]}
                style={{ marginBlock: 15 }}
                onValueChanged={(value) => setGenderToShow(value.index)}
            ></SegmentedControl>
        </div>
    );

    const listItems = generalClassification[genderToShow ? "men" : "women"].map(
        (rider, i) => (
            <ListItem
                key={i}
                index={i + 1}
                title={rider.name}
                onClick={() =>
                    onItemClick ? onItemClick(rider.athleteId) : null
                }
            >
                <span className={typography.bodyReduced}>
                    {secondsToMinutes(rider.timeInSeconds)}
                </span>
            </ListItem>
        )
    );

    return (
        <ScrollingListView header={header} listItems={listItems} {...props} />
    );
};
