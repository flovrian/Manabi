import { useState } from "react";

const TIMEOUT_INTERVAL = 3500;

export interface AlertData<T extends AlertType = AlertType> {
    key: string;
    type: T;
    payload: AlertPayloads[T];
    timeoutTask?: number;
    onClick?: () => void;
    isRemoving?: boolean;
}

export type AlertPayloads = {
    mail: {
        sender: string;
        message: string;
        userId: string;
    };
};

export type AlertType = keyof AlertPayloads;

export function useAlerts() {

    const [alerts, setAlerts] = useState<AlertData[]>([]);

    // T is simply 'Type', a variable compiled at run-time; this allows flexibility - T in this case is an alert type.
    function addAlert<T extends AlertType>(type: T, payload: AlertPayloads[T]) {
        const alertKey = crypto.randomUUID();

        setAlerts(prev => {
            const newAlert = { key: alertKey, type, payload };
            startAlertRemoval(alertKey);
            return [...prev, newAlert];
        });
    }

    function startAlertRemoval(key: string) {
        const timeoutTask = window.setTimeout(() => {
            setAlerts(prev =>
                prev.map(alert =>
                alert.key === key ? { ...alert, isRemoving: true } : alert
            ));
            setTimeout(() => removeAlert(key), 500)
        }, TIMEOUT_INTERVAL);

        setAlerts(prev =>
            prev.map(alert =>
                alert.key === key ? { ...alert, timeoutTask: timeoutTask } : alert
        ));
    }

    function cancelAlertRemoval(key: string) {
        setAlerts(prev =>
            prev.map(alert => {
                if (alert.key === key && alert.timeoutTask) {
                    clearTimeout(alert.timeoutTask);
                    return { ...alert, timeoutTask: undefined, isRemoving: false };
                }
                return alert;
            })
        );
    }

    function removeAlert(key: string) {
        setAlerts(prev => prev.filter(alert => alert.key !== key));
    }

    function forceAlertRemoval(key: string) {

        setAlerts(prev =>
            prev.map(alert =>
                alert.key === key ? { ...alert, isRemoving: true } : alert
            ));
        setTimeout(() => removeAlert(key), 400)

    }

    return {
        alerts,
        addAlert,
        startAlertRemoval,
        cancelAlertRemoval,
        removeAlert,
        forceAlertRemoval
    };
}