import React from "react";

import { useResultsDataContext } from "../../../contexts/ResultsData";
import { SegmentListItem } from "../../Misc/SegmentListItem";

export const RidersView: React.ComponentType<
    React.HTMLAttributes<HTMLDivElement>
> = ({ ...props }) => {
    const { talliedResults } = useResultsDataContext();

    const riders = Object.values(talliedResults.riders);

    return (
        <div {...props}>
            {riders.map((rider, i) => {
                <SegmentListItem
                    index={i + 1}
                    title={rider.name}
                    description={"something"}
                ></SegmentListItem>;
            })}
        </div>
    );
};
