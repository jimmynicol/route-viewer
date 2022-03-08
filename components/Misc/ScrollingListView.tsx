import React, { useRef, useState, useEffect } from "react";
import {
    findParentByAttr,
    measurePrevSiblingsHeight,
} from "../../utils/domUtils";

export const ScrollingListView: React.ComponentType<
    {
        header: React.ReactNode;
        listItems: React.ReactNode;
    } & React.HTMLAttributes<HTMLDivElement>
> = ({ header, listItems, ...props }) => {
    const listRef = useRef<HTMLDivElement>(null);
    const [listHeight, setListHeight] = useState(0);

    useEffect(() => {
        const listEl = listRef.current;
        if (!listEl) return;

        const componentEl = findParentByAttr(listEl, "data-scroll-container");
        if (!componentEl) return;

        const componentHeight = componentEl.getBoundingClientRect().height;
        const siblingsHeight = measurePrevSiblingsHeight(listEl);

        setListHeight(componentHeight - siblingsHeight);
    }, [listRef, setListHeight]);

    return (
        <div {...props}>
            {header}
            <div
                ref={listRef}
                style={{
                    height: listHeight,
                    overflowY: "scroll",
                    paddingBlockEnd: 30,
                }}
            >
                {listItems}
            </div>
        </div>
    );
};
