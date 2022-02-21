import React from "react";
import cw from "classnames";

export const ForwardChevronIcon: React.ComponentType<{
    classNames?: string[];
}> = ({ classNames }) => {
    return (
        <svg
            className={cw(classNames)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
        >
            <path
                d="M34.0862824,29.9998589 C34.0862824,29.1381883 33.7416001,28.3454118 33.086753,27.7250118 L5.78894119,0.978705884 C5.16854119,0.392752942 4.41028236,0.0825882354 3.51409412,0.0825882354 C1.75630589,0.0825882354 0.377647059,1.4268 0.377647059,3.2190353 C0.377647059,4.08070589 0.722329413,4.87348236 1.27376471,5.4594353 L26.3656942,29.9998589 L1.27376471,54.5402959 C0.722329413,55.1262333 0.377647059,55.8845083 0.377647059,56.7806472 C0.377647059,58.5729248 1.75630589,59.9171366 3.51409412,59.9171366 C4.41028236,59.9171366 5.16854119,59.6069295 5.78894119,58.9865295 L33.086753,32.2747059 C33.7416001,31.6197883 34.0862824,30.8615295 34.0862824,29.9998589 Z"
                transform="translate(14.706 2)"
            ></path>
        </svg>
    );
};
