import "./arrival_screen.css";
import {useIntl} from "react-intl";
import React, {ReactElement} from "react";

interface ArrivalScreenProps {
    siteTitle: string;
    imagePath: string;
    iconName: string;
}

export default function ArrivalScreen({ siteTitle, imagePath, iconName }: ArrivalScreenProps) : ReactElement {

    const intl = useIntl();

    return (
        <div className={"manabi-arrival-wrapper"}>
            <div className={"manabi-arrival-inner"}>
                <div className={"manabi-arrival-bg"}>
                    <div className={"manabi-arrival-content-wrapper"}>
                        <div className={`manabi-arrival-border ${iconName}`}>
                            <img
                                className={"manabi-arrival-icon"}
                                alt={`${iconName} icon`}
                                src={imagePath}
                            />
                            {
                                siteTitle && (
                                    <div className={"manabi-arrival-text"}>
                                        {intl.formatMessage({id: `${siteTitle}`})}
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}