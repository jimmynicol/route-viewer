import React from "react";
import { Units, useUnits } from "../data/useUnits";

type SetUnits = React.Dispatch<React.SetStateAction<Units>>;

export interface UnitsCtx {
    units: Units;
    setUnits: SetUnits;
}

const defaultUpdate: SetUnits = () => Units.METRIC;

export const UnitsContext = React.createContext<UnitsCtx>({
    units: Units.METRIC,
    setUnits: defaultUpdate,
});

export const UnitsProvider = ({ children }: { children: React.ReactNode }) => {
    const [units, setUnits] = useUnits();

    return (
        <UnitsContext.Provider value={{ units, setUnits }}>
            {children}
        </UnitsContext.Provider>
    );
};

export const useUnitsContext = (): UnitsCtx => {
    return React.useContext(UnitsContext);
};
