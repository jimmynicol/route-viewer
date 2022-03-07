import React, { useEffect, useRef, useState } from "react";
import cw from "classnames";

import { DetailedSegment } from "../../data/stravaDataTypes";
import {
    distanceStr,
    elevationStr,
    secondsToMinutes,
    timeStrToSeconds,
    unitsStr,
} from "../../utils/unitConversions";
import { Sheet, SheetViewState } from "../Sheets/Sheet";
import { SheetMetadata } from "../Misc/SheetMetadata";
import { SheetTitle } from "../Misc/SheetTitle";
import { useUnitsContext } from "../../contexts/Units";
import {
    StreetViewButton,
    StreetViewButtonMode,
} from "../StreetViewButton/StreetViewButton";
import { CloseIcon } from "../Icons/CloseIcon";
import { animated, useSpring, config } from "react-spring";
import { StreetView, StreetViewMode } from "../StreetView/StreetView";
import { ElevationProfile } from "../ElevationProfile/ElevationProfile";
import { QOMIcon } from "../Icons/QOMIcon";
import { KOMIcon } from "../Icons/KOMIcon";

import styles from "../Sheets/Sheet.module.css";
import typography from "../../styles/Typography.module.css";
import sheetStyles from "./SegmentSheet.module.css";

const QOM: React.ComponentType<{ segment: DetailedSegment }> = ({
    segment,
}) => {
    return (
        <div className={sheetStyles.KOM}>
            <QOMIcon />
            <span className={typography.body}>
                QOM - {secondsToMinutes(timeStrToSeconds(segment.xoms.qom))}
            </span>
        </div>
    );
};

const KOM: React.ComponentType<{ segment: DetailedSegment }> = ({
    segment,
}) => {
    return (
        <div className={sheetStyles.KOM}>
            <KOMIcon />
            <span className={typography.body}>
                KOM - {secondsToMinutes(timeStrToSeconds(segment.xoms.kom))}
            </span>
        </div>
    );
};

const defaultStreetViewPosition = { y: 0 };

export const SegmentSheet: React.ComponentType<{
    segment: DetailedSegment | null;
    viewState: SheetViewState;
    setViewState: (value: SheetViewState) => void;
    onClose: () => void;
}> = ({ segment, viewState, setViewState, onClose }) => {
    const { units } = useUnitsContext();
    const [{ y }, api] = useSpring(() => defaultStreetViewPosition);
    const [streetViewMode, setStreetViewMode] = useState<StreetViewMode>(
        StreetViewMode.NONE
    );
    const [streetViewHeight, setStreetViewHeight] = useState(0);
    const [streetViewStart, setStreetViewStart] = useState(0);
    const [elevationHeight, setElevationHeight] = useState(0);
    const [defaultHeight, setDefaultHeight] = useState(0);
    const [fullHeight, setFullHeight] = useState(0);

    const componentRef = useRef<HTMLDivElement>(null);
    const controlsRef = useRef<HTMLDivElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);

    // on mount set the height of the street view container
    useEffect(() => {
        const controlsEl = controlsRef.current;
        const buttonsEl = buttonsRef.current;
        const componentEl = componentRef.current;

        if (!controlsEl || !buttonsEl || !componentEl) return;

        const parentWrapperEl = componentEl.parentElement;
        if (!parentWrapperEl) return;

        const parentWrapperRect = parentWrapperEl.getBoundingClientRect();
        const controlsRect = controlsEl.getBoundingClientRect();
        const buttonsRect = buttonsEl.getBoundingClientRect();
        const newStreetViewHeight =
            parentWrapperRect.height - controlsRect.height;
        const newDefaultHeight = controlsRect.height + 30;
        const newFullHeight = window.innerHeight - newDefaultHeight - 80;

        setStreetViewHeight(newStreetViewHeight);
        setStreetViewStart(parentWrapperRect.height + 100);
        setElevationHeight(newStreetViewHeight - buttonsRect.height);
        setDefaultHeight(newDefaultHeight);
        setFullHeight(newFullHeight);
    }, [viewState, segment, componentRef, controlsRef, buttonsRef]);

    const openStreetView = (mode: StreetViewMode) => {
        setStreetViewMode(mode);

        // start moving the street view to just under the controls rect
        api.start({
            y: -(streetViewHeight + 70),
            immediate: false,
            config: config.stiff,
        });
    };

    const closeStreetView = () => {
        api.start({
            y: 0,
            immediate: false,
            config: config.stiff,
        });
    };

    const link = `https://www.strava.com/segments/${segment?.id}`;
    const userHasPREffort = segment
        ? segment.athlete_segment_stats?.effort_count > 0
        : false;

    return (
        <Sheet
            className={sheetStyles.segmentSheet}
            viewState={viewState}
            onChangeViewState={setViewState}
            defaultHeight={defaultHeight}
            fullHeight={fullHeight}
        >
            <CloseIcon className={sheetStyles.closeButton} onClick={onClose} />
            {segment && (
                <div
                    ref={componentRef}
                    className={sheetStyles.segmentSheetWrapper}
                >
                    <div ref={controlsRef} style={{ paddingBottom: "5px" }}>
                        <SheetTitle title={segment.name} link={link} />
                        <div className={styles.metadataContainer}>
                            <SheetMetadata
                                num={distanceStr(units, segment.distance, 2)}
                                unit={unitsStr(units, "km")}
                                description={"Distance"}
                            />
                            <SheetMetadata
                                num={elevationStr(
                                    units,
                                    segment.total_elevation_gain,
                                    0
                                )}
                                unit={unitsStr(units, "m")}
                                description={"Elevation"}
                            />
                            <SheetMetadata
                                num={segment.average_grade.toFixed(1)}
                                unit={"%"}
                                description={"Avg Grade"}
                            />
                        </div>
                        <div className={sheetStyles.xomContainer}>
                            <KOM segment={segment} />
                            <QOM segment={segment} />
                        </div>
                        {userHasPREffort && (
                            <div
                                className={cw(
                                    sheetStyles.yourPR,
                                    typography.body
                                )}
                            >
                                <span>
                                    Your PR&nbsp;-&nbsp;
                                    {secondsToMinutes(
                                        segment.athlete_segment_stats
                                            .pr_elapsed_time
                                    )}
                                </span>
                                <span>
                                    <a
                                        href={`https://www.strava.com/activities/${segment.athlete_segment_stats.pr_activity_id}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {segment.athlete_segment_stats.pr_date}
                                    </a>
                                </span>
                            </div>
                        )}
                    </div>
                    <div
                        ref={buttonsRef}
                        className={sheetStyles.streetViewButtonContainer}
                    >
                        <StreetViewButton
                            mode={StreetViewButtonMode.START}
                            onClick={() => openStreetView(StreetViewMode.START)}
                        />
                        <StreetViewButton
                            mode={StreetViewButtonMode.STOP}
                            onClick={() => openStreetView(StreetViewMode.END)}
                        />
                    </div>
                    <ElevationProfile
                        segment={segment}
                        height={elevationHeight}
                    />
                    <animated.div
                        className={sheetStyles.streetViewContainer}
                        style={{
                            height: streetViewHeight,
                            top: streetViewStart,
                            y,
                        }}
                    >
                        {streetViewMode !== StreetViewMode.NONE && (
                            <StreetView
                                segment={segment}
                                mode={streetViewMode}
                                onClose={closeStreetView}
                            />
                        )}
                    </animated.div>
                </div>
            )}
        </Sheet>
    );
};
