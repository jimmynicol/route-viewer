import React from "react";

import { HR } from "../../Misc/HR";
import { ScrollingListView } from "../../Misc/ScrollingListView";
import { segmentListItems } from "../../Misc/SegmentListItems";
import { DetailedSegment } from "../../../data/stravaDataTypes";
import { useResultsDataContext } from "../../../contexts/ResultsData";

import typography from "../../../styles/Typography.module.css";

export const SegmentsView: React.ComponentType<
    {
        onItemClick: (segment: DetailedSegment) => void;
    } & React.HTMLAttributes<HTMLDivElement>
> = ({ onItemClick, ...props }) => {
    const {
        results: { segments, segmentsInOrder },
    } = useResultsDataContext();

    const len = segmentsInOrder.length;

    const header = (
        <div>
            <h2
                className={typography.titleReduced}
                style={{ marginBlockStart: 0 }}
            >
                {len} Segment{len === 1 ? "" : "s"}
            </h2>
            <HR />
        </div>
    );

    const _segments: DetailedSegment[] = segmentsInOrder.map(
        (segmentId: string) => {
            return segments[segmentId].segment;
        }
    );

    const listItems = segmentListItems(_segments, onItemClick);

    return (
        <ScrollingListView header={header} listItems={listItems} {...props} />
    );
};
