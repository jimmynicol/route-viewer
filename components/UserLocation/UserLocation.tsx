import React from "react";
import cw from "classnames";
import styles from "./UserLocation.module.css";
import { useGeolocation } from "../../contexts/Geolocation";

export const UserLocation: React.ComponentType<React.HTMLProps<"div">> = (
    props
) => {
    const {
        canUseGeolocation,
        wantsGeolocation,
        setWantsGeolocation,
        isLocating,
    } = useGeolocation();

    if (!canUseGeolocation) return null;

    const toggleWantsGeolocation = () => {
        setWantsGeolocation(!wantsGeolocation);
    };

    return (
        <div
            className={cw(styles.userLocation, props.className)}
            onClick={toggleWantsGeolocation}
        >
            {isLocating ? (
                <svg
                    className={styles.spinner}
                    viewBox="0 0 30 30"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g>
                        <rect
                            className={cw(styles.spinnerRect, styles.spinnerR1)}
                            transform="rotate(-45 7.929 7.929)"
                            x="5.929"
                            y="2.929"
                            width="4"
                            height="10"
                            rx="2"
                        />
                        <rect
                            className={cw(styles.spinnerRect, styles.spinnerR2)}
                            transform="rotate(90 5 15)"
                            x="3"
                            y="10"
                            width="4"
                            height="10"
                            rx="2"
                        />
                        <rect
                            className={cw(styles.spinnerRect, styles.spinnerR3)}
                            transform="rotate(45 7.929 22.071)"
                            x="5.929"
                            y="17.071"
                            width="4"
                            height="10"
                            rx="2"
                        />
                        <rect
                            className={cw(styles.spinnerRect, styles.spinnerR4)}
                            x="13"
                            y="20"
                            width="4"
                            height="10"
                            rx="2"
                        />
                        <rect
                            className={cw(styles.spinnerRect, styles.spinnerR5)}
                            transform="rotate(-45 22.071 22.071)"
                            x="20.071"
                            y="17.071"
                            width="4"
                            height="10"
                            rx="2"
                        />
                        <rect
                            className={cw(styles.spinnerRect, styles.spinnerR6)}
                            transform="rotate(90 25 15)"
                            x="23"
                            y="10"
                            width="4"
                            height="10"
                            rx="2"
                        />
                        <rect
                            className={cw(styles.spinnerRect, styles.spinnerR7)}
                            transform="rotate(45 22.071 7.929)"
                            x="20.071"
                            y="2.929"
                            width="4"
                            height="10"
                            rx="2"
                        />
                        <rect
                            className={styles.spinnerRect}
                            x="13"
                            width="4"
                            height="10"
                            rx="2"
                        />
                    </g>
                </svg>
            ) : (
                <svg
                    className={styles.icon}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 64 64"
                >
                    <path
                        d="M4.32659125,31.7131458 L27.3322965,31.8056721 C27.7949281,31.8056721 27.9490965,31.9598406 27.9490965,32.422409 L28.0108018,55.2431501 C28.0108018,59.9614617 33.6850965,61.0717143 35.8130123,56.4767059 L59.1273071,6.33276681 C61.2550966,1.73777733 57.5851808,-1.31521215 53.1752439,0.720114172 L2.75377019,24.0959248 C-1.31693929,25.9771458 -0.515130866,31.6823248 4.32659125,31.7131458 Z"
                        transform="translate(2 2)"
                    ></path>
                </svg>
            )}
        </div>
    );
};
