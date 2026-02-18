import "./loading_screen.css";
import {useIntl} from "react-intl";
import {useEffect, useState} from "react";

export default function LoadingScreen() {

    const intl = useIntl();
    const availableLoadingMessages = 5;
    const loadingScreenMessages : string[] = [];

    const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

    function getRandomLoadingMessage() : string {
        return loadingScreenMessages[~~(Math.random() * loadingScreenMessages.length)];
    }

    useEffect(() => {
        for(let i = 0; i < availableLoadingMessages - 1; i++) {
            loadingScreenMessages.push(`loading.message.${i}`);
        }
        setLoadingMessage(getRandomLoadingMessage);
        setInterval(() => {
            setLoadingMessage(getRandomLoadingMessage)
        }, 6000)


    }, [])

    return (
        <div>
            <div className={"manabi-loading-wrapper"}>
                <div className={"manabi-loading-inner"}>
                    <div className={"manabi-loading-bg"}>
                        <div className={"manabi-loading-text-wrapper"}>
                            <div className={"manabi-loading-loader-wrapper"}>
                                <div className="manabi-loader">
                                    <span></span><span></span><span></span>
                                    <span></span><span className="manabi-loader-center"></span><span></span>
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                            {
                                loadingMessage && (
                                    <div className={"manabi-loading-text"}>
                                        {intl.formatMessage({id: `${loadingMessage}`})}
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