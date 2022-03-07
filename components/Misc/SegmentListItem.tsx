import React from "react";
import cw from "classnames";

import { ForwardChevronIcon } from "../Icons/ForwardChevronIcon";

import typography from "../../styles/Typography.module.css";
import styles from "./SegmentListItem.module.css";

export interface SegmentListItemProps {
    index: number;
    title: string;
    description?: string;
}

export const SegmentListItem: React.ComponentType<
    SegmentListItemProps & React.HTMLAttributes<HTMLDivElement>
> = ({ index, title, description, ...props }) => {
    return (
        <div {...props} className={cw(styles.segmentListItem, props.className)}>
            <p className={cw(styles.index, typography.bodyReduced)}>{index}</p>
            <h3 className={cw(styles.title, typography.subTitle)}>{title}</h3>
            <p className={cw(styles.description, typography.body)}>
                {description || props.children}
            </p>
            <ForwardChevronIcon className={styles.forwardChevron} />
        </div>
    );
};
