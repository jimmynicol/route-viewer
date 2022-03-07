import React from "react";
import cw from "classnames";
import { GCRider } from "../../data/resultsConverter";

import typography from "../../styles/Typography.module.css";
import { secondsToMinutes } from "../../utils/unitConversions";

export const GeneralClassificationTable: React.ComponentType<{
    riders: GCRider[];
    label: string;
    classNames?: string[];
}> = ({ riders, label, classNames }) => {
    return (
        <div className={cw(...(classNames || []))}>
            <table>
                <tbody>
                    {riders.map((item: GCRider, i: number) => (
                        <tr key={i} className={cw(typography.bodySmall)}>
                            <td>{i + 1}</td>
                            <td>{item.name}</td>
                            <td>{secondsToMinutes(item.timeInSeconds)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
