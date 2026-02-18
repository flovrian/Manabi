import alert_styles from './manabi_alert.module.css'

interface AlertProps {
    imagePath: string,
    iconName: string,
    alertText?: string,
    onClick?: () => void,
    onMouseEnter?: () => void,
    onMouseLeave?: () => void,
    isRemoving?: boolean
}

export default function ManabiAlert({
    imagePath,
    iconName,
    alertText,
    onClick,
    onMouseEnter,
    onMouseLeave,
    isRemoving
}: AlertProps & {
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}) {
    return (
        <div className={`${alert_styles["manabi-alert-wrapper"]} ${isRemoving ? alert_styles["manabi-alert-wrapper-exit"] : ""}`}
             onClick={onClick}
             onMouseEnter={onMouseEnter}
             onMouseLeave={onMouseLeave}
        >
            <div className={alert_styles['manabi-alert-icon-wrapper']}></div>
            <img
                className={alert_styles['manabi-alert-img']}
                src={imagePath}
                alt={iconName}
            />
            {alertText}
        </div>
    );
}