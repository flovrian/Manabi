
import DockIcon from "../DockIcon";
import logoutImg from "/images/dock/logoutIcon.png"
import {useNavigate} from "react-router-dom";
import {config} from "../../../../config";
import {AuthProvider, useAuth} from "../../../providers/AuthProvider";

export function LogoutIcon() {

    const navigate = useNavigate();
    const { logoutUser } = useAuth();

    return (
        <DockIcon
            imagePath={logoutImg}
            iconName="Logout"
            onClick={async () => {
                await logoutUser();
                navigate("/login");
            }}>
        </DockIcon>
    );
}