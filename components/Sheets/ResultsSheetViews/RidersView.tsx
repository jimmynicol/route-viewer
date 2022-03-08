import React, { useEffect, useRef, useState } from "react";

import { useResultsDataContext } from "../../../contexts/ResultsData";
import {
    riderResultsToHighlightString,
    RiderStats,
} from "../../../data/resultsConverter";
import { HR } from "../../Misc/HR";
import { SegmentListItem } from "../../Misc/SegmentListItem";
import { measurePrevSiblingsHeight } from "../../../utils/domUtils";

import typography from "../../../styles/Typography.module.css";

export const RidersView: React.ComponentType<
    {
        onItemClick?: (rider: RiderStats) => void;
    } & React.HTMLAttributes<HTMLDivElement>
> = ({ onItemClick, ...props }) => {
    const { talliedResults } = useResultsDataContext();
    const listRef = useRef<HTMLDivElement>(null);
    const [listHeight, setListHeight] = useState(0);

    const riders = Object.values(talliedResults.riders);
    const sort = (a: RiderStats, b: RiderStats) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    };

    useEffect(() => {
        const listEl = listRef.current;
        const componentEl = listEl?.parentElement?.parentElement?.parentElement;
        if (!listEl || !componentEl) return;

        const componentHeight = componentEl.getBoundingClientRect().height;
        const siblingsHeight = measurePrevSiblingsHeight(listEl);

        setListHeight(componentHeight - siblingsHeight);
    }, [talliedResults, listRef, setListHeight]);

    return (
        <div {...props}>
            <h2 style={{ marginBlockStart: 0 }}>{riders.length} Riders</h2>
            <HR />
            <div
                ref={listRef}
                style={{
                    height: listHeight,
                    overflowY: "scroll",
                    paddingBlockEnd: 30,
                }}
            >
                {riders.sort(sort).map((rider, i) => (
                    <SegmentListItem
                        key={i}
                        index={i + 1}
                        title={rider.name}
                        onClick={() =>
                            onItemClick ? onItemClick(rider) : null
                        }
                    >
                        <span className={typography.caption}>
                            {riderResultsToHighlightString(rider)}
                        </span>
                    </SegmentListItem>
                ))}
            </div>
        </div>
    );
};

export const ScrollingListView: React.ComponentType<
    {
        title: string;
        onItemClick: (value: any) => void;
    } & React.HTMLAttributes<HTMLDivElement>
> = ({ title, onItemClick, ...props }) => {
    const listRef = useRef<HTMLDivElement>(null);
    const [listHeight, setListHeight] = useState(0);

    useEffect(() => {
        const listEl = listRef.current;
        const componentEl = listEl?.parentElement?.parentElement?.parentElement;
        if (!listEl || !componentEl) return;

        const componentHeight = componentEl.getBoundingClientRect().height;
        const siblingsHeight = measurePrevSiblingsHeight(listEl);

        setListHeight(componentHeight - siblingsHeight);
    }, [listRef, setListHeight]);

    return (
        <div {...props}>
            <h2 style={{ marginBlockStart: 0 }}>{title}</h2>
            <HR />
            <div
                ref={listRef}
                style={{
                    height: listHeight,
                    overflowY: "scroll",
                    paddingBlockEnd: 30,
                }}
            >
                {props.children}
            </div>
        </div>
    );
};
