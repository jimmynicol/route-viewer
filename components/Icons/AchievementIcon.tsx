import React from "react";
import { SegmentAchievement, Sex } from "../../data/stravaDataTypes";
import { CupIcon } from "./CupIcon";
import { KOMIcon } from "./KOMIcon";
import { PRIcon } from "./PRIcon";
import { QOMIcon } from "./QOMIcon";

export const AchievementIcon: React.ComponentType<
    {
        achievement: SegmentAchievement;
        gender?: Sex;
    } & React.HTMLAttributes<HTMLDivElement>
> = ({ achievement, gender, ...props }) => {
    if (achievement === SegmentAchievement.PR) {
        return <PRIcon style={{ height: 17 }} />;
    }

    if (achievement === SegmentAchievement.CUP) {
        return <CupIcon style={{ height: 15 }} />;
    }

    if (achievement === SegmentAchievement.XOM) {
        if (gender === Sex.Female) {
            return <QOMIcon style={{ height: 17, fill: "#FEC835" }} />;
        } else {
            return <KOMIcon style={{ height: 17, fill: "#FEC835" }} />;
        }
    }

    if (achievement === SegmentAchievement.CLUB_XOM) {
        if (gender === Sex.Female) {
            return <QOMIcon style={{ fill: "#ccc" }} />;
        } else {
            return <KOMIcon style={{ fill: "#ccc" }} />;
        }
    }

    return null;
};
