import React from "react";
import cw from "classnames";

export const KOMIcon: React.ComponentType<{ classNames?: string[] }> = ({
    classNames,
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            className={cw(classNames)}
        >
            <path
                d="M6.34795277,21.8393859 L6.4632756,21.8393859 L10.9385669,39.9942001 C11.8151339,43.6159418 13.7298425,45.438345 17.5361103,45.438345 L42.380693,45.438345 C46.2102993,45.438345 48.1019528,43.6159418 49.0014804,39.9942001 L53.4537639,21.8393859 C53.4995906,21.8393859 53.5227402,21.8393859 53.5690395,21.8393859 C56.8444725,21.8393859 59.5435277,19.1634331 59.5435277,15.8415591 C59.5435277,12.5658898 56.8676221,9.88993702 53.5690395,9.88993702 C50.2931339,9.88993702 47.6172284,12.5889449 47.6172284,15.8415591 C47.6172284,16.5797481 47.732504,17.2948819 47.9862048,17.9408032 L42.288567,21.4472126 C41.4580631,21.9777638 40.9966772,21.8162835 40.5352914,21.1934646 L33.1995591,11.2971024 C34.8374174,10.2359528 35.9216221,8.36740159 35.9216221,6.26820473 C35.9216221,3.01554331 33.2456693,0.316535434 29.97,0.316535434 C26.648126,0.316535434 23.9952756,2.99248819 23.9952756,6.26820473 C23.9952756,8.39050395 25.1025355,10.2359528 26.7634489,11.2971024 L19.3123937,21.2857323 C18.8971654,21.8854961 18.4588347,22.0008662 17.6745355,21.5164252 L11.930504,17.9869607 C12.1611496,17.317937 12.2995748,16.6028504 12.2995748,15.8415591 C12.2995748,12.5889449 9.62362206,9.88993702 6.34795277,9.88993702 C3.04913386,9.88993702 0.373228347,12.5658898 0.373228347,15.8415591 C0.373228347,19.1634331 3.07223623,21.8393859 6.34795277,21.8393859 Z M29.97,8.64425198 C28.6781575,8.64425198 27.5939528,7.56000001 27.5939528,6.26820473 C27.5939528,4.95330709 28.6781575,3.9152126 29.97,3.9152126 C31.2387402,3.9152126 32.3229449,4.99941733 32.3229449,6.26820473 C32.3229449,7.56000001 31.2848977,8.64425198 29.97,8.64425198 Z M16.4057481,24.8151969 C17.882126,25.7148662 20.3273859,25.7609764 21.8499213,23.7078898 L29.97,12.7965355 L38.1131339,23.7309922 C39.5895119,25.7148662 42.0117166,25.7148662 43.3496694,24.8844095 L50.108882,20.7320788 L50.1315591,20.7320788 L46.948252,33.7426772 L12.9685512,33.7426772 L9.80820474,20.7782363 L16.4057481,24.8151969 Z M6.34795277,18.2407087 C5.05611024,18.2407087 3.97190552,17.1564567 3.97190552,15.8415591 C3.97190552,14.5266614 5.05611024,13.4886142 6.34795277,13.4886142 C7.61669293,13.4886142 8.70089765,14.5728189 8.70089765,15.8415591 C8.70089765,17.1564567 7.66285041,18.2407087 6.34795277,18.2407087 Z M53.5690395,18.2407087 C52.2542363,18.2407087 51.2158111,17.1564567 51.2158111,15.8415591 C51.2158111,14.5728189 52.3000631,13.4886142 53.5690395,13.4886142 C54.860693,13.4886142 55.944945,14.5266614 55.944945,15.8415591 C55.944945,17.1564567 54.860693,18.2407087 53.5690395,18.2407087 Z M17.5130551,41.9550142 C15.7829292,41.9550142 14.7909922,41.1937574 14.3988189,39.5559024 L13.8221103,37.2259938 L46.0950237,37.2259938 L45.5413229,39.5559024 C45.1491969,41.1937574 44.1570709,41.9550142 42.4269922,41.9550142 L17.5130551,41.9550142 Z"
                transform="translate(2 9.087)"
            ></path>
        </svg>
    );
};
