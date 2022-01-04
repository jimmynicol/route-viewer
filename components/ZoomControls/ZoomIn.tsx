import React, { CSSProperties } from "react";
import cw from "classnames";

import styles from "./ZoomControls.module.css";

export const ZoomIn: React.ComponentType<{
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
                    d="M29.7730228,59.5808132 C32.702767,59.5808132 35.1555112,57.0258528 35.1555112,54.3005656 L35.1555112,35.3938853 L53.7215345,35.3938853 C56.5489996,35.3938853 59.0018136,32.9410713 59.0018136,30.0113969 C59.0018136,27.0817225 56.5489996,24.6289783 53.7215345,24.6289783 L35.1555112,24.6289783 L35.1555112,5.72228063 C35.1555112,2.89474574 32.702767,0.476048057 29.7730228,0.476048057 C26.8433484,0.476048057 24.3906042,2.89474574 24.3906042,5.72228063 L24.3906042,24.6289783 L5.79046467,24.6289783 C3.09925537,24.6289783 0.510255361,27.0817225 0.510255361,30.0113969 C0.510255361,32.9410713 3.09925537,35.3938853 5.79046467,35.3938853 L24.3906042,35.3938853 L24.3906042,54.3005656 C24.3906042,57.0258528 26.8433484,59.5808132 29.7730228,59.5808132 Z"
                    transform="translate(2.349 2)"
                ></path>
            </svg>
        </div>
    );
};
