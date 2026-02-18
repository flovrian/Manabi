import React, {useState, useEffect, ReactElement} from "react";
import DockIcon from "../DockIcon";
import pomodoroImg from "/images/dock/pomodoroIcon.png"

export function PomodoroIcon() : ReactElement {

    const [timeLeft, setTimeLeft] = useState(0);

    function addPomodoroTimer() {
        /* Just for testing, though the final time will indeed be 25 minutes. */
        const pomodoroDuration = 25 * 60 * 1000;
        const endTime = Date.now() + pomodoroDuration;
        localStorage.setItem("manabi-pomodoro-end", endTime.toString());
    }

    useEffect(() => {
        const updateTime = () => {
            const storedEndStr = localStorage.getItem("manabi-pomodoro-end");
            if (!storedEndStr) {
                setTimeLeft(0);
                return;
            }
            const endTime = parseInt(storedEndStr, 10);
            const remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            setTimeLeft(remainingTime);
        };
        updateTime();
        const timerUpdateInterval = setInterval(
            updateTime,
            1000
        );
        return () => clearInterval(timerUpdateInterval);
    }, []);

    const remainingMinutes = Math.floor(timeLeft / 60);
    const remainingSeconds = timeLeft % 60;

    return (
        <DockIcon
            onClick={() => {
                addPomodoroTimer();
            }}
            imagePath={pomodoroImg}
            iconName="Pomodoro"
            iconType="pomodoro"
        >
            {
                timeLeft > 0 ?
                    `${remainingMinutes.toString()}:${remainingSeconds.toString().padStart(2,"0")}`
                    : ""
            }
        </DockIcon>
    );
}