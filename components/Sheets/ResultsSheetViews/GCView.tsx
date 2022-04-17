import React, { useEffect, useState } from "react";

import { ScrollingListView } from "../../Misc/ScrollingListView";
import { HR } from "../../Misc/HR";
import { SegmentedControl } from "../../Misc/SegmentedControl";
import { useResultsDataContext } from "../../../contexts/ResultsData";
import { secondsToMinutes } from "../../../utils/unitConversions";
import { ListItem } from "../../Misc/ListItem";
import { Sex } from "../../../data/stravaDataTypes";

import typography from "../../../styles/Typography.module.css";

export const GCView: React.ComponentType<
    {
        genderToShow: Sex;
        onItemClick?: (athleteId: string) => void;
    } & React.HTMLAttributes<HTMLDivElement>
> = ({ genderToShow, onItemClick, ...props }) => {
    const {
        talliedResults: { generalClassification },
    } = useResultsDataContext();
    const [_genderToShow, setGenderToShow] = useState(
        genderToShow === Sex.Female ? 0 : 1
    );

    useEffect(() => {
        setGenderToShow(genderToShow === Sex.Female ? 0 : 1);
    }, [genderToShow]);

    const header = (
        <div>
            <h2
                className={typography.titleReduced}
                style={{ marginBlockStart: 0 }}
            >
                General Classification
            </h2>
            <HR />
            <SegmentedControl
                labels={["Women", "Men"]}
                highlightedItem={_genderToShow}
                style={{ marginBlock: 15 }}
                onValueChanged={(value) => setGenderToShow(value.index)}
            ></SegmentedControl>
        </div>
    );

    const listItems = generalClassification[
        _genderToShow ? "men" : "women"
    ].map((rider, i) => (
        <ListItem
            key={i}
            index={i + 1}
            title={rider.name}
            onClick={() => (onItemClick ? onItemClick(rider.athleteId) : null)}
        >
            <span className={typography.bodyReduced}>
                {secondsToMinutes(rider.timeInSeconds)}
            </span>
        </ListItem>
    ));

    return (
        <ScrollingListView header={header} listItems={listItems} {...props} />
    );
};
