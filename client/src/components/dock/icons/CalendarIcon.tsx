import DockIcon from "../DockIcon";
import { useNavigate } from "react-router-dom";
import calendarImg from "/images/dock/calendarIcon.png";
import {useState} from "react";

export function CalendarIcon() {

    const navigate = useNavigate();
    const [calendarDates, setCalendarDates] = useState(5);

    /* Grab this all via an API later on -> e.g. /api/calendar*/

    function addCalendarDate() {
        setCalendarDates(calendarDates + 1);
    }

    return (
        <DockIcon
            imagePath={calendarImg}
            iconName='Calendar'
            iconType={'calendar'}
            badgeContent={calendarDates}
            onClick={() => addCalendarDate()}
        />
    );
}