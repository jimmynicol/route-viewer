import React from "react";
import cw from "classnames";

import { ForwardChevronIcon } from "../Icons/ForwardChevronIcon";

import typography from "../../styles/Typography.module.css";
import styles from "./ListItem.module.css";

export interface ListItemProps {
    index: number;
    title: string;
    description?: string;
}

export const ListItem: React.ComponentType<
    ListItemProps & React.HTMLAttributes<HTMLDivElement>
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
