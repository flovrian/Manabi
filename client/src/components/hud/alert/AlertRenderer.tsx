import { useNavigate } from "react-router";
import { useIntl } from "react-intl";
import ManabiAlert from "./ManabiAlert";
import { AlertData } from "./useAlert";

interface AlertRendererProps {
    alert: AlertData;
    startAlertRemoval: (key: string) => void;
    cancelAlertRemoval: (key: string) => void;
    forceAlertRemoval: (key: string) => void;
}

export default function AlertRenderer({ alert, startAlertRemoval, cancelAlertRemoval, forceAlertRemoval}: AlertRendererProps) {
    const navigator = useNavigate();
    const intl = useIntl();

    let imagePath = "";
    let iconName = alert.type;
    let alertText = "";
    let onClick: () => void = () => {};

    switch(alert.type) {
        case "mail":
            imagePath = "/images/dock/mailIcon.png";
            alertText = intl.formatMessage(
                { id: 'notifications.user_message' },
                { user: alert.payload.sender, message: alert.payload.message }
            );
            onClick = () => navigator(`/mails/${alert.payload.userId}`);
            break;
    }
    return (
        <ManabiAlert
            key={alert.key}
            imagePath={imagePath}
            iconName={iconName}
            alertText={alertText}
            onClick={() => {
                forceAlertRemoval(alert.key);
                onClick();
            }}
            onMouseEnter={() => cancelAlertRemoval(alert.key)}
            onMouseLeave={() => startAlertRemoval(alert.key)}
            isRemoving={alert.isRemoving}
        />
    );
}


