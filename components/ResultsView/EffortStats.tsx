import React from "react";

import { SheetMetadata } from "../Misc/SheetMetadata";
import { MetadataContainer } from "../Misc/MetadataContainer";

export const EffortStats: React.ComponentType<{
    riders: number;
    prs: number;
    xoms: number;
    clubXoms: number;
}> = ({ riders, prs, xoms, clubXoms }) => {
    return (
        <MetadataContainer>
            <SheetMetadata num={riders} unit={""} description={"Riders"} />
            <SheetMetadata num={prs} unit={""} description={"PRs"} />
            <SheetMetadata num={xoms} unit={""} description={"XOMs"} />
            <SheetMetadata num={clubXoms} unit={""} description={"Club XOMs"} />
        </MetadataContainer>
    );
};
