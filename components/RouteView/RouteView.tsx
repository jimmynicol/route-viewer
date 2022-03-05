import React, { useEffect, useState } from "react";
import cw from "classnames";

import { useAPITokenContext } from "../../contexts/APIToken";
import { useQueryParamsContext } from "../../contexts/QueryParams";
import { DetailedSegment } from "../../data/stravaDataTypes";
import { useRoute, useSegments } from "../../data/useStravaData";
import { SizeClass, useHorizontalSizeClass } from "../../utils/useSizeClass";

import { Map } from "../Map/Map";
import { OAuth } from "../OAuth/OAuth";
import { RouteSheet } from "../Sheets/RouteSheet";
import { SegmentSheet } from "../Sheets/SegmentSheet";
import { SheetViewState } from "../Sheets/Sheet";

import styles from "./RouteView.module.css";
import typography from "../../styles/Typography.module.css";
import errorStyles from "../../styles/ErrorMessage.module.css";
import loadingStyles from "../../styles/LoadingMessage.module.css";

export const RouteView: React.ComponentType = () => {
    const { tokenResponse } = useAPITokenContext();
    const { queryParams } = useQueryParamsContext();
    const sizeClass = useHorizontalSizeClass();

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
                <h2
                    className={cw(loadingStyles.title, typography.titleReduced)}
                >
                    Route Data Loading...
                </h2>
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
                    <div
                        className={
                            sizeClass === SizeClass.COMPACT
                                ? errorStyles.compact
                                : errorStyles.regular
                        }
                    >
                        <h2
                            className={cw(
                                errorStyles.title,
                                typography.titleReduced
                            )}
                        >
                            Error.
                        </h2>
                        <p
                            className={cw(
                                errorStyles.description,
                                typography.bodyReduced
                            )}
                        >
                            {err?.message}
                        </p>
                    </div>
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
