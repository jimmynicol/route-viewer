import React from "react";
import cw from "classnames";

import { useResultsDataContext } from "../../../contexts/ResultsData";
import { secondsToMinutes } from "../../../utils/unitConversions";
import { HR } from "../../Misc/HR";
import { ListItem } from "../../Misc/ListItem";
import { ScrollingListView } from "../../Misc/ScrollingListView";
import { AchievementIcon } from "../../Icons/AchievementIcon";
import { PREffort } from "../../../data/resultsConverter";

import typography from "../../../styles/Typography.module.css";

export const ClubXOMView: React.ComponentType<
    {
        onItemClick?: (effort: PREffort) => void;
    } & React.HTMLAttributes<HTMLDivElement>
> = ({ onItemClick, ...props }) => {
    const {
        results,
        talliedResults: { clubXoms },
    } = useResultsDataContext();

    const totalClubXoms = clubXoms.men.length + clubXoms.women.length;

    const header = (
        <div>
            <h2
                className={typography.titleReduced}
                style={{ marginBlockStart: 0 }}
            >
                {totalClubXoms} Club XOMs
            </h2>
            <HR />
        </div>
    );

    const allclubXoms = [...clubXoms.women, ...clubXoms.men];

    const listItems = allclubXoms.map((effort, i) => (
        <ListItem
            key={i}
            index={i + 1}
            title={effort.athlete_name}
            onClick={() => (onItemClick ? onItemClick(effort) : null)}
            stackDescription={true}
        >
            <span
                className={cw(
                    typography.bodyReduced,
                    typography.verticalAlignCenter
                )}
            >
                <AchievementIcon
                    achievement={effort.achievement}
                ></AchievementIcon>
                <span>
                    {secondsToMinutes(effort.elapsed_time)}
                    {effort.average_power > 0 && (
                        <span>{` @ ${effort.average_power}W`}</span>
                    )}
                </span>
            </span>
            <span className={typography.bodyReduced}>
                {results.segments[effort.segmentId].segment.name}
            </span>
        </ListItem>
    ));

    return (
        <ScrollingListView header={header} listItems={listItems} {...props} />
    );
};
