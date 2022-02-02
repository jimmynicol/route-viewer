import { useQuery } from "react-query";
import { DetailedSegment, Route } from "./stravaDataTypes";

const STRAVA_API_ENDPOINT = "https://www.strava.com/api/v3";

async function stravaAPI(path: string, token: string) {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);

    const response = await fetch(`${STRAVA_API_ENDPOINT}${path}`, { headers });
    if (!response.ok) {
        const msg = await response.json();
        throw new Error(msg.message);
    }

    return await response.json();
}

const queryOptions = {
    cacheTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
};

export function useRoute(routeId: string, token: string) {
    const path = `/routes/${routeId}`;
    return useQuery<Route, Error>(
        "route",
        () => stravaAPI(path, token),
        queryOptions
    );
}

export function useSegments(segmentIds: string[], token: string) {
    return useQuery<DetailedSegment[], Error>(
        "segments",
        () => {
            const requests = segmentIds.map((segmentId) => {
                return stravaAPI(`/segments/${segmentId}`, token);
            });
            return Promise.all(requests);
        },
        queryOptions
    );
}
