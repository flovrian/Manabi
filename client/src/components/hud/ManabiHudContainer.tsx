import alert_styles from "./alert/manabi_alert.module.css";
import React, { ReactNode, createContext, useContext } from "react";
import { AlertPayloads, AlertType, useAlerts } from "./alert/useAlert";
import AlertRenderer from "./alert/AlertRenderer";

interface HudContextType {
    addAlert: <T extends AlertType>(
        type: T,
        payload: AlertPayloads[T]
    ) => void;
}

const hudContext = createContext<HudContextType | undefined>(undefined);

export function useHUD() {
    const context = useContext(hudContext);
    if (!context) {
        throw new Error("Attempted to use hud hook outside of hub container.");
    }
    return context;
}

// Implement 'Focus Mode' that turns off alerts.
export default function ManabiHudContainer({ children }: { children: ReactNode; }) {
    const {alerts, addAlert, startAlertRemoval, cancelAlertRemoval, forceAlertRemoval} = useAlerts();
    return (
        <hudContext.Provider value={{ addAlert }}>
            {children}
            <div className={alert_styles["manabi-alert-container"]}>
                {alerts.map(alert => (
                    <AlertRenderer
                        key={alert.key}
                        alert={alert}
                        startAlertRemoval={startAlertRemoval}
                        cancelAlertRemoval={cancelAlertRemoval}
                        forceAlertRemoval={ forceAlertRemoval}
                    />
                ))}
            </div>
        </hudContext.Provider>
    );
}
