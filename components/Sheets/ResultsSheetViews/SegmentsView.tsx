import React from "react";

import { HR } from "../../Misc/HR";
import { ScrollingListView } from "../../Misc/ScrollingListView";
import { segmentListItems } from "../../Misc/SegmentListItems";
import { SummarySegment } from "../../../data/stravaDataTypes";
import { useResultsDataContext } from "../../../contexts/ResultsData";

export const SegmentsView: React.ComponentType<
    {
        onItemClick: (segment: SummarySegment) => void;
    } & React.HTMLAttributes<HTMLDivElement>
> = ({ onItemClick, ...props }) => {
    const {
        results: { segments, segmentsInOrder },
    } = useResultsDataContext();

    const len = segmentsInOrder.length;

    const header = (
        <div>
            <h2 style={{ marginBlockStart: 0 }}>
                {len} Segment{len === 1 ? "" : "s"}
            </h2>
            <HR />
        </div>
    );

    const _segments: SummarySegment[] = segmentsInOrder.map(
        (segmentId: string) => {
            return segments[segmentId].segment;
        }
    );

    const listItems = segmentListItems(_segments, onItemClick);

    return (
        <ScrollingListView header={header} listItems={listItems} {...props} />
    );
};
