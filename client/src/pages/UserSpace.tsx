import "../styles/start_page.css";

import Typewriter from 'typewriter-effect';

import {useIntl} from "react-intl";
import {useAuth, useProfileData} from "../providers/AuthProvider";
import {useEffect, useState} from "react";


export default function UserSpace() {

    const userData = useProfileData();
    const intl = useIntl();

    const [currentGreeting, setCurrentGreeting] = useState("");

    useEffect(() => {
        if (!userData) return;

        const currentGreetings = getCurrentGreetings(new Date().getHours());
        const randomGreetingId = currentGreetings[Math.floor(Math.random() * currentGreetings.length)];

        setCurrentGreeting(
            intl.formatMessage({ id: randomGreetingId }, { user: userData.username })
        );

        return () => {}
    }, [userData, intl])


    function getCurrentGreetings(currentHour : number) : Array<string> {
        if (currentHour >= 5 && currentHour < 12){
            return ["user.welcome.morning.1", "user.welcome.morning.2", "user.welcome.morning.3"];
        }
        else if (currentHour >= 12 && currentHour < 18) {
            return ["user.welcome.afternoon.1", "user.welcome.afternoon.2", "user.welcome.afternoon.3"];
        }
        else {
            return ["user.welcome.night.1", "user.welcome.night.2", "user.welcome.night.3"];
        }
    }

    return (
        <div className="start-page">
            <div className="manabi-welcome-wrapper">
                <div className="manabi-title-wrapper">
                    <span className="manabi-title-main">学び</span>
                    <span className="manabi-title-outline">学び</span>
                </div>
                <div className="manabi-welcome-text-wrapper">
                <span id={"manabi-welcome-text-field"} className="manabi-welcome-text">
                    <Typewriter
                        onInit={(typewriter) => {
                            typewriter
                                .pauseFor(50)
                                .typeString(currentGreeting)
                                .start();
                        }}
                        options={{ cursor: "", delay: 20 }}
                    />
                </span>
                </div>
            </div>
        </div>
    )
}