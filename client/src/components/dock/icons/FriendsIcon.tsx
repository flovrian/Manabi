import DockIcon from "../DockIcon";
import { useNavigate } from "react-router-dom";
import friendsImg from "/images/dock/friendsIcon.png";
import {useState} from "react";

export function FriendsIcon() {

    const navigate = useNavigate();

    /* Uses to pop out badge whenever a new mail is received. */
    const [pop, setPop] = useState(false);

    /* Grab this all via an API later on -> e.g. /api/userdata*/
    const [friendAmount, setFriends] = useState(24);

    function addFriend() {
        setPop(true);
        setFriends(friendAmount + 1);
        setTimeout(() => setPop(false), 200);
    }

    return (
            <DockIcon
                imagePath={friendsImg}
                iconName='Friends'
                iconType={'friends'}
                badgePop={pop}
                badgeContent={friendAmount}
                onClick={() => addFriend()}
            />
    );
}