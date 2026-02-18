import tray_styles from './manabi_tray.module.css'
import bellImg from '/images/hud/bellImg.png'

import {getSavedLanguage} from "../../../helpers/UserHelper";
import {useHUD} from "../ManabiHudContainer";

import React, {useState, useEffect} from "react";

export default function ManabiTray() {

    const { addAlert } = useHUD();
    const userLanguage= getSavedLanguage();

    const [currentDate, setCurrentDate] = useState(formatTime(new Date()));
    const [notificationAmount, setNotificationAmount] = useState(2);

    useEffect(() => {
        const timeUpdateInterval = setInterval(function (){
            setCurrentDate(formatTime(new Date()));
        }, 60000);
        return () => clearInterval(timeUpdateInterval);
    }, []);

    function formatTime(date : Date) {
        return new Intl.DateTimeFormat(userLanguage, {
            year: "numeric", month: "long",
            day: "numeric", weekday: "long",
            hour: "2-digit", minute: "2-digit"
        }).format(date);
    }

    return (
        <div className={tray_styles['manabi-tray-wrapper']}>
            <div className={tray_styles['manabi-tray-date-wrapper']}>
                {currentDate}
            </div>
            <div
                className={tray_styles['manabi-tray-notification-wrapper']}
                id="manabi-bell-button"
                onClick={() => {
                    addAlert('mail', {sender: 'ルーベン', message: '抹茶は飲みましたか？', userId: '78412215212512'})
                }}
            >
                <img
                    className={tray_styles['manabi-tray-notification-img']}
                    src={bellImg}
                    alt="Avatar"
                />
                {
                    notificationAmount >= 1 ? (
                        <div
                            className={tray_styles['manabi-tray-notification-circle']}
                        >
                        </div>) : ''
                }
            </div>
        </div>
    );
}