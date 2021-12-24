import React, { useEffect, useRef, useState } from "react";

export interface GeolocationCtx {
    canUseGeolocation: boolean;
    wantsGeolocation: boolean;
    setWantsGeolocation: React.Dispatch<React.SetStateAction<boolean>>;
    location: GeolocationCoordinates | null;
    isLocating: boolean;
}

export const GeolocationContext = React.createContext<GeolocationCtx>(
    {} as GeolocationCtx
);

export const GeolocationProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [canUseGeolocation] = useState("geolocation" in navigator);
    const [wantsGeolocation, setWantsGeolocation] = useState(false);
    const [isLocating, setIsLocating] = useState<boolean>(false);
    const [location, setLocation] = useState<GeolocationCoordinates | null>(
        null
    );
    const [watcher, setWatcher] = useState<number | null>(null);

    useEffect(() => {
        if (!canUseGeolocation) return;
        if (!wantsGeolocation) {
            if (watcher) {
                navigator.geolocation.clearWatch(watcher);
                setWatcher(null);
                setIsLocating(false);
            }
            return;
        }

        setIsLocating(true);

        const onEvent = (position: GeolocationPosition) => {
            setLocation(position.coords);
            setIsLocating(false);
        };
        const onError = () => {
            setLocation(null);
            setIsLocating(false);
        };

        navigator.geolocation.getCurrentPosition(onEvent, onError);
        if (watcher) {
            const _watcher = navigator.geolocation.watchPosition(
                onEvent,
                onError
            );
            setWatcher(_watcher);
        }
    }, [
        canUseGeolocation,
        wantsGeolocation,
        setLocation,
        watcher,
        setWatcher,
        setIsLocating,
    ]);

    return (
        <GeolocationContext.Provider
            value={{
                canUseGeolocation,
                wantsGeolocation,
                setWantsGeolocation,
                location,
                isLocating,
            }}
        >
            {children}
        </GeolocationContext.Provider>
    );
};

export const useGeolocation = (): GeolocationCtx => {
    return React.useContext(GeolocationContext);
};
