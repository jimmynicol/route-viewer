import React, { useEffect, useState } from "react";

import { useAPITokenContext } from "../../contexts/APIToken";
import { useQueryParamsContext } from "../../contexts/QueryParams";
import { DetailedSegment } from "../../data/stravaDataTypes";
import { useRoute, useSegments } from "../../data/useStravaData";

import { Map } from "../Map/Map";
import { OAuth } from "../OAuth/OAuth";
import { RouteSheet } from "../RouteSheet/RouteSheet";
import { SegmentSheet } from "../SegmentSheet/SegmentSheet";
import { SheetViewState } from "../Sheet/Sheet";
import { UnitSwitcher } from "../UnitSwitcher/UnitSwitcher";

import styles from "./RouteView.module.css";
import errorStyles from "../../styles/ErrorMessage.module.css";
import loadingStyles from "../../styles/LoadingMessage.module.css";

export const RouteView: React.ComponentType = () => {
    const { tokenResponse } = useAPITokenContext();
    const { queryParams } = useQueryParamsContext();
    const [currentSegment, setCurrentSegment] =
        useState<DetailedSegment | null>(null);

    const [routeViewState, setRouteViewState] = useState<SheetViewState>(
        SheetViewState.DEFAULT
    );
    const [segmentViewState, setSegmentViewState] = useState<SheetViewState>(
        SheetViewState.DEFAULT
    );

    const { access_token } = tokenResponse;
    const { routeId, segmentIds } = queryParams;

    useEffect(() => {
        if (currentSegment === null) {
            setSegmentViewState(SheetViewState.HIDE);
            setRouteViewState(SheetViewState.DEFAULT);
        } else {
            setSegmentViewState(SheetViewState.DEFAULT);
            setRouteViewState(SheetViewState.DEFAULT);
        }
    }, [currentSegment, setRouteViewState, setSegmentViewState]);

    const routeResult = useRoute(routeId, access_token);
    const {
        isLoading: isRouteLoading,
        isError: isRouteError,
        data: route,
        error: routeError,
    } = routeResult;

    const segmentsResult = useSegments(segmentIds, access_token);
    const {
        isLoading: isSegmentsLoading,
        isError: isSegmentsError,
        data: segments,
        error: segmentsError,
    } = segmentsResult;

    if (isRouteLoading || isSegmentsLoading) {
        return (
            <div className={loadingStyles.loadingMessage}>
                <h3>Route Data Loading...</h3>
            </div>
        );
    }

    if (isRouteError || isSegmentsError) {
        const err = routeError || segmentsError;

        if (err?.message === "Authorization Error") {
            return <OAuth />;
        } else {
            return (
                <div className={errorStyles.errorMessage}>
                    <h3>Error</h3>
                    <p>{err?.message}</p>
                </div>
            );
        }
    }

    return (
        <div className={styles.mapContainer}>
            <Map
                route={route}
                segments={segments || []}
                currentSegment={currentSegment}
                setCurrentSegment={setCurrentSegment}
            />
            <UnitSwitcher className={styles.unitSwitcher} />
            <RouteSheet
                route={route}
                segments={segments || []}
                viewState={routeViewState}
                setViewState={setRouteViewState}
                onSegmentSelect={setCurrentSegment}
            />
            <SegmentSheet
                segment={currentSegment}
                viewState={segmentViewState}
                setViewState={setSegmentViewState}
                onClose={() => setCurrentSegment(null)}
            />
        </div>
    );
};
