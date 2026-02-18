import {useRouteError} from "react-router-dom";
import {useIntl} from "react-intl";

interface ErrorData {
    message: string;
    code?: number;
}

function validateErrorData(error: unknown): error is ErrorData {
    return (
        typeof error === "object"
        && error !== null
        && "message" in error
    );
}

function ErrorPage() {
    const routeError = useRouteError();
    const intl = useIntl();
    if (validateErrorData(routeError)) {
        return (
            <div>
                <h1>${intl.formatMessage({ id: 'error.title' })}</h1>
                {
                    routeError.code && <p>{intl.formatMessage({ id: 'error.code' })}{routeError.code}</p>
                }
                <pre>
                    {
                    intl.formatMessage({ id: `${routeError.message}` })
                    }
                </pre>
            </div>
        );
    }
    return <div>{intl.formatMessage({ id: 'error.unknown' })}</div>;
}