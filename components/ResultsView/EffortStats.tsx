import React from "react";
import cw from "classnames";
import { SheetMetadata } from "../SheetMetadata/SheetMetadata";

export const EffortStats: React.ComponentType<{
    riders: number;
    prs: number;
    xoms: number;
    clubXoms: number;
    classNames?: string[];
}> = ({ riders, prs, xoms, clubXoms, classNames }) => {
    return (
        <div className={cw(...(classNames || []))}>
            <SheetMetadata num={riders} unit={""} description={"Riders"} />
            <SheetMetadata num={prs} unit={""} description={"PRs"} />
            <SheetMetadata num={xoms} unit={""} description={"XOMs"} />
            <SheetMetadata num={clubXoms} unit={""} description={"Club XOMs"} />
        </div>
    );
};
