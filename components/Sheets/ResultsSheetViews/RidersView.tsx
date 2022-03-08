import React from "react";

import { useResultsDataContext } from "../../../contexts/ResultsData";
import {
    riderResultsToHighlightString,
    RiderStats,
} from "../../../data/resultsConverter";
import { HR } from "../../Misc/HR";
import { ListItem } from "../../Misc/ListItem";
import { ScrollingListView } from "../../Misc/ScrollingListView";

import typography from "../../../styles/Typography.module.css";

export const RidersView: React.ComponentType<
    {
        onItemClick?: (rider: RiderStats) => void;
    } & React.HTMLAttributes<HTMLDivElement>
> = ({ onItemClick, ...props }) => {
    const { talliedResults } = useResultsDataContext();

    const riders = Object.values(talliedResults.riders);
    const sort = (a: RiderStats, b: RiderStats) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    };

    const header = (
        <div>
            <h2 style={{ marginBlockStart: 0 }}>{riders.length} Riders</h2>
            <HR />
        </div>
    );

    const listItems = riders.sort(sort).map((rider, i) => (
        <ListItem
            key={i}
            index={i + 1}
            title={rider.name}
            onClick={() => (onItemClick ? onItemClick(rider) : null)}
        >
            <span className={typography.caption}>
                {riderResultsToHighlightString(rider)}
            </span>
        </ListItem>
    ));

    return (
        <ScrollingListView header={header} listItems={listItems} {...props} />
    );
};
