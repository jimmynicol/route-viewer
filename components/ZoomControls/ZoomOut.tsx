import React, { CSSProperties } from "react";
import cw from "classnames";

import styles from "./ZoomControls.module.css";

export const ZoomOut: React.ComponentType<{
    className?: string;
    style?: CSSProperties;
    onClick?: (map: google.maps.Map) => void;
    map?: google.maps.Map;
}> = ({ className, style, onClick, map }) => {
    return (
        <div
            className={cw(styles.control, className)}
            style={style}
            onClick={() => (onClick && map ? onClick(map) : null)}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                <path
                    d="M5.85858779,11.1044015 L54.3535526,11.1044015 C57.214282,11.1044015 59.6959526,8.62273096 59.6959526,5.65858981 C59.6959526,2.69444863 57.214282,0.212848622 54.3535526,0.212848622 L5.85858779,0.212848622 C3.1357172,0.212848622 0.516258365,2.69444863 0.516258365,5.65858981 C0.516258365,8.62273096 3.1357172,11.1044015 5.85858779,11.1044015 Z"
                    transform="translate(2 26.353)"
                ></path>
            </svg>
        </div>
    );
};
