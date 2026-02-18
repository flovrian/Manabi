import DockIcon from "../DockIcon";
import { useNavigate } from "react-router-dom";
import mailImage from "/images/dock/mailIcon.png";
import React, {useState} from "react";

export function MailIcon() {

    const navigate = useNavigate();

    /* Uses to pop out badge whenever a new mail is received. */
    const [pop, setPop] = useState(false);

    /* Grab this all via an API later on -> e.g. /api/mails*/
    const [mailAmount, setMails] = useState(122);

    function addMail() {
        setMails(mailAmount + 1);
        setPop(true);
        setTimeout(() => setPop(false), 200);
    }


    return (
        <DockIcon
            imagePath={mailImage}
            iconName='Mails'
            iconType={'mails'}
            badgeContent={mailAmount}
            badgePop={pop}
            onClick={() => addMail()}
        />
    );
}
