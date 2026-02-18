import alert_styles from "./alert/manabi_alert.module.css";
import React, { ReactNode, createContext, useContext } from "react";
import { AlertPayloads, AlertType, useAlerts } from "./alert/useAlert";
import AlertRenderer from "./alert/AlertRenderer";
import UserAvatar from "./avatar/UserAvatar";
import ManabiTray from "./system-tray/ManabiTray";
import {useProfileData} from "../../providers/AuthProvider";
import {Outlet} from "react-router-dom";
import DockContainer, {DOCK_START_PAGE} from "../dock/DockContainer";
import {NoteIcon} from "../dock/icons/NoteIcon";
import {CalendarIcon} from "../dock/icons/CalendarIcon";
import {PomodoroIcon} from "../dock/icons/PomodoroIcon";
import {MailIcon} from "../dock/icons/MailIcon";
import {FriendsIcon} from "../dock/icons/FriendsIcon";
import {SettingsIcon} from "../dock/icons/SettingsIcon";
import {LogoutIcon} from "../dock/icons/LogoutIcon";

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
export default function ManabiHudContainer() {

    const {alerts, addAlert, startAlertRemoval, cancelAlertRemoval, forceAlertRemoval} = useAlerts();
    const userProfileData = useProfileData();

    return (
        <hudContext.Provider value={{ addAlert }}>
            { userProfileData && (
                <>
                    <UserAvatar/>
                    <ManabiTray/>
                    <DockContainer wrapperClass={DOCK_START_PAGE}>
                        <NoteIcon/>
                        <CalendarIcon/>
                        <PomodoroIcon/>
                        <MailIcon/>
                        <FriendsIcon/>
                        <SettingsIcon/>
                        <LogoutIcon/>
                    </DockContainer>
                </>
            ) }
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
            <Outlet />
        </hudContext.Provider>
    );
}
