import avatar_styles from './avatar.module.css'
import DefaultAvatar from '/images/hud/defaultAvatar.png'
import {fetchProfileAvatar} from "../../../helpers/UserHelper"
import React, {useState, useEffect} from "react";


export default function UserAvatar() {

    const [avatarURL, setUserAvatarURL] = useState("");

    useEffect(() => {

        /* Write Backend first, I have to get the user-avatar. */

        fetchProfileAvatar("12412412412").then((res) => {
            if(res !== null){
                setUserAvatarURL(res)
                console.log("Successfully fetched user avatar.");
            }
        });
    }, []);

    return (
        <div className={avatar_styles['manabi-user-avatar-base-wrapper']}>
            <div className={avatar_styles['manabi-user-avatar-base']}>
                <img
                    className={avatar_styles['manabi-user-avatar-img']}
                    src={avatarURL || DefaultAvatar}
                    alt="Avatar"
                />
            </div>
        </div>
    );
}