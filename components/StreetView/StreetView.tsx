import React, { useEffect, useRef, useState } from "react";

import { DetailedSegment } from "../../data/stravaDataTypes";
import { CloseIcon } from "../Icons/CloseIcon";

import styles from "./StreetView.module.css";

export enum StreetViewMode {
    NONE = 0,
    START = 1,
    END = 2,
}

function determineHeading(segment: DetailedSegment, mode: StreetViewMode) {
    const decode = google.maps.geometry.encoding.decodePath(
        segment.map.polyline
    );

    const fromPosition =
        mode === StreetViewMode.START ? decode[0] : decode[decode.length - 2];
    const toPosition =
        mode === StreetViewMode.START ? decode[1] : decode[decode.length - 1];

    return google.maps.geometry.spherical.computeHeading(
        fromPosition,
        toPosition
    );
}

export const StreetView: React.ComponentType<{
    segment: DetailedSegment;
    mode: StreetViewMode;
    onClose: () => void;
}> = ({ segment, mode, onClose }) => {
    const isGoogleMapsLoaded = google && google.maps;
    const target = useRef<HTMLDivElement>(null);
    const [hasStreetView, setHasStreetView] = useState(true);

    useEffect(() => {
        if (!segment) return;
        if (!isGoogleMapsLoaded || !target.current) return;

        const position = {
            lat:
                mode === StreetViewMode.START
                    ? segment.start_latlng[0]
                    : segment.end_latlng[0],
            lng:
                mode === StreetViewMode.START
                    ? segment.start_latlng[1]
                    : segment.end_latlng[1],
        };

        const sv = new google.maps.StreetViewPanorama(target.current, {
            position,
            pov: {
                heading: determineHeading(segment, mode),
                pitch: 0,
            },
            fullscreenControl: false,
            addressControl: false,
        });

        sv.addListener("status_changed", () => {
            const status = sv.getStatus();
            setHasStreetView(status === google.maps.StreetViewStatus.OK);
        });
    }, [segment, isGoogleMapsLoaded, target, mode, setHasStreetView]);

    const label = mode === StreetViewMode.START ? "Start" : "End";

    if (!isGoogleMapsLoaded) {
        return null;
    }

    return (
        <div className={styles.streetView}>
            <div
                ref={target}
                className={styles.streetViewTarget}
                draggable={false}
            />
            <div className={styles.controlsContainer}>
                <span>{label}</span>
                <CloseIcon
                    className={styles.streetViewClose}
                    onClick={onClose}
                />
            </div>
            {hasStreetView === false && <h3>No Street View Available</h3>}
        </div>
    );
};
