import dock_styles from "./dock.module.css";
import React, {ReactElement} from "react";

interface DockIconProps {
    imagePath: string;
    iconName: string; /* Alt icon text */
    iconClass?: string;
    iconType?: string;
    badgeContent?: string | number; /* Used to display amount of mails or the pomodoro timer */
    badgePop?: boolean;
    onClick?: () => void;
    children?: React.ReactNode;
}

export default function DockIcon({
     imagePath,
     iconName,
     badgeContent,
     badgePop,
     iconType,
     onClick,
     children
}: DockIconProps): ReactElement {

    /* Used to manually modify badges and icons, e.g. pomodoro might require a different position*/
    const iconClass = iconType !== undefined ? dock_styles[`${iconType}-icon-img`] : '';
    const badgeClass = iconType !== undefined ? dock_styles[`${iconType}-icon-text`] : '';

    return (
        <div className={dock_styles['manabi-dock-icon-wrapper']} onClick={onClick}>
            <div className={`${dock_styles['manabi-dock-icon-img']} ${iconClass}`}>
                <img src={imagePath} alt={iconName} />
            </div>
            <div
                className={`${dock_styles['manabi-dock-icon-text']} ${badgeClass} ${badgePop ? dock_styles['manabi-badge-pop'] : ''}`}>
                {children || badgeContent}
            </div>
        </div>
    );
}