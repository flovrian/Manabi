import DockIcon from "../DockIcon";
import { useNavigate } from "react-router-dom";
import settingsImg from "/images/dock/settingsIcon.png";
import ArrivalScreen from "../../hud/arrival/ArrivalScreen";
import friendsImg from "*.png";

export function SettingsIcon() {
    const navigate = useNavigate();
    return (
        <DockIcon
            imagePath={settingsImg}
            iconName='Settings'
            iconType={'settings'}
            onClick={() => {
                navigate('/settings')
            }}
        />
    );
}