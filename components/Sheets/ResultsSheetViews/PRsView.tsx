import React, { useState } from "react";

import { useResultsDataContext } from "../../../contexts/ResultsData";
import { PREffort } from "../../../data/resultsConverter";
import { HR } from "../../Misc/HR";
import { ListItem } from "../../Misc/ListItem";
import { ScrollingListView } from "../../Misc/ScrollingListView";
import { SegmentedControl } from "../../Misc/SegmentedControl";
import { secondsToMinutes } from "../../../utils/unitConversions";

import typography from "../../../styles/Typography.module.css";

export const PRsView: React.ComponentType<
    {
        onItemClick?: (effort: PREffort) => void;
    } & React.HTMLAttributes<HTMLDivElement>
> = ({ onItemClick, ...props }) => {
    const {
        results,
        talliedResults: { prs },
    } = useResultsDataContext();
    const [genderToShow, setGenderToShow] = useState(0);

    const totalPRs = prs.men.length + prs.women.length;

    const header = (
        <div>
            <h2
                className={typography.titleReduced}
                style={{ marginBlockStart: 0 }}
            >
                {totalPRs} PRs
            </h2>
            <HR />
            <SegmentedControl
                labels={["Women", "Men"]}
                style={{ marginBlock: 15 }}
                onValueChanged={(value) => setGenderToShow(value.index)}
            ></SegmentedControl>
        </div>
    );

    const listItems = prs[genderToShow ? "men" : "women"].map((effort, i) => (
        <ListItem
            key={i}
            index={i + 1}
            title={effort.athlete_name}
            stackDescription={true}
            onClick={() => (onItemClick ? onItemClick(effort) : null)}
        >
            <span className={typography.caption}>
                {results.segments[effort.segmentId].segment.name}
            </span>
            <span className={typography.caption}>
                {secondsToMinutes(effort.elapsed_time)}
                {effort.average_power > 0 && (
                    <span>{` @ ${effort.average_power}W`}</span>
                )}
            </span>
        </ListItem>
    ));

    return (
        <ScrollingListView header={header} listItems={listItems} {...props} />
    );
};
