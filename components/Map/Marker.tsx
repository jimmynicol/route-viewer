import React, { useEffect } from "react";

export const Marker: React.ComponentType<google.maps.MarkerOptions> = (
    options
) => {
    useEffect(() => {
        const { map } = options;
        if (!map) return;
        new google.maps.Marker(options);
    }, [options]);

    return <></>;
};
