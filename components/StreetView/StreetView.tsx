import React, { useEffect, useRef, useState } from "react";

import { DetailedSegment } from "../../data/stravaDataTypes";
import { CloseButton } from "../Icons/CloseButton";

import styles from "./StreetView.module.css";

export enum StreetViewMode {
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
        if (!isGoogleMapsLoaded || !target.current) return;

        const position = {
            lat:
                mode === StreetViewMode.START
                    ? segment.start_latitude
                    : segment.end_latitude,
            lng:
                mode === StreetViewMode.START
                    ? segment.start_longitude
                    : segment.end_longitude,
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
                style={{ height: "100%", zIndex: 50 }}
                draggable={false}
            />
            <div className={styles.controlsContainer}>
                <span>{label}</span>
                <CloseButton
                    className={styles.streetViewClose}
                    onClick={onClose}
                />
            </div>
            {hasStreetView === false && <h3>No Street View Available</h3>}
        </div>
    );
};
