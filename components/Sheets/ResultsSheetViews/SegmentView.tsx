import React, { useState } from "react";
import cw from "classnames";

import { useUnitsContext } from "../../../contexts/Units";
import {
    distanceStr,
    unitsStr,
    elevationStr,
    secondsToMinutes,
    timeStrToSeconds,
} from "../../../utils/unitConversions";
import { HR } from "../../Misc/HR";
import { ListItem } from "../../Misc/ListItem";
import { MetadataContainer } from "../../Misc/MetadataContainer";
import { ScrollingListView } from "../../Misc/ScrollingListView";
import { SegmentedControl } from "../../Misc/SegmentedControl";
import { SheetMetadata } from "../../Misc/SheetMetadata";
import { SheetTitle } from "../../Misc/SheetTitle";
import { useResultsDataContext } from "../../../contexts/ResultsData";
import { SegmentAchievement } from "../../../data/stravaDataTypes";
import { AchievementIcon } from "../../Icons/AchievementIcon";
import { KOMIcon } from "../../Icons/KOMIcon";
import { QOMIcon } from "../../Icons/QOMIcon";

import typography from "../../../styles/Typography.module.css";
import styles from "./SegmentSheet.module.css";

export const SegmentView: React.ComponentType<
    {
        segmentId: number;
        onItemClick?: (athleteId: string) => void;
    } & React.HTMLAttributes<HTMLDivElement>
> = ({ segmentId, onItemClick, ...props }) => {
    const { units } = useUnitsContext();
    const {
        results: { segments },
    } = useResultsDataContext();
    const [genderToShow, setGenderToShow] = useState(0);

    const segment = segments[segmentId].segment;
    const efforts = segments[segmentId].efforts;
    const clubXoms = segments[segmentId].clubXoms;
    const link = `https://www.strava.com/segments/${segment?.id}`;

    const header = (
        <div>
            <SheetTitle title={segment.name} link={link} />
            <HR style={{ marginBlockStart: 15 }} />
            <MetadataContainer>
                <SheetMetadata
                    num={distanceStr(units, segment.distance, 2)}
                    unit={unitsStr(units, "km")}
                    description={"Distance"}
                />
                <SheetMetadata
                    num={elevationStr(units, segment.total_elevation_gain, 0)}
                    unit={unitsStr(units, "m")}
                    description={"Elevation"}
                />
                <SheetMetadata
                    num={segment.average_grade.toFixed(1)}
                    unit={"%"}
                    description={"Avg Grade"}
                />{" "}
            </MetadataContainer>
            <HR />
            <div className={cw(styles.segmentSheetRecords, typography.body)}>
                <span>All Time:</span>
                <span>
                    <KOMIcon style={{ height: 19, fill: "#FEC835" }} /> KOM{" "}
                    {secondsToMinutes(timeStrToSeconds(segment.xoms.kom))}
                </span>
                <span>
                    <QOMIcon style={{ height: 19, fill: "#FEC835" }} /> QOM{" "}
                    {secondsToMinutes(timeStrToSeconds(segment.xoms.qom))}
                </span>
            </div>
            <div
                className={cw(styles.segmentSheetRecords, typography.body)}
                style={{ paddingBlockStart: 0 }}
            >
                <span>Club:</span>
                <span>
                    <KOMIcon style={{ height: 19, fill: "#ccc" }} /> KOM{" "}
                    {secondsToMinutes(clubXoms.men[0].elapsed_time)}
                </span>
                <span>
                    <QOMIcon style={{ height: 19, fill: "#ccc" }} /> QOM{" "}
                    {secondsToMinutes(clubXoms.women[0].elapsed_time)}
                </span>
            </div>
            <HR />
            <SegmentedControl
                labels={["Women", "Men"]}
                style={{ marginBlock: 15 }}
                onValueChanged={(value) => setGenderToShow(value.index)}
            ></SegmentedControl>
        </div>
    );

    const listItems = efforts[genderToShow ? "men" : "women"].map(
        (effort, i) => {
            const hasAchievement =
                effort.achievement !== SegmentAchievement.NONE;
            const athleteId = effort.athlete_link.split("/").slice(-1)[0];

            return (
                <ListItem
                    key={i}
                    index={i + 1}
                    title={effort.athlete_name}
                    onClick={() => {
                        onItemClick ? onItemClick(athleteId) : null;
                    }}
                >
                    {hasAchievement && (
                        <AchievementIcon
                            achievement={effort.achievement}
                        ></AchievementIcon>
                    )}
                    <span className={typography.semanticallyReduced}>
                        {secondsToMinutes(effort.elapsed_time)}
                        {effort.average_power > 0 && (
                            <span>{` @ ${effort.average_power}W`}</span>
                        )}
                    </span>
                </ListItem>
            );
        }
    );

    return (
        <ScrollingListView header={header} listItems={listItems} {...props} />
    );
};
