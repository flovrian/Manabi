import {Routes, Route, Outlet} from "react-router-dom"
import {IntlProvider} from "react-intl";
import React from "react";

import UserSpace from "./pages/UserSpace";
import {getSavedLanguage} from "./helpers/UserHelper";

import en from "./languages/en.json";
import ja from './languages/ja.json'
import ManabiHudContainer from "../src/components/hud/ManabiHudContainer";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import {AuthProvider} from "./providers/AuthProvider";
import AuthenticatedRoute from "./routes/AuthenticatedRotue";
import LoadingScreen from "./components/hud/loading/LoadingScreen";
import StartPage from "./pages/StartPage";
import UnauthenticatedRoute from "./routes/UnauthenticatedRoute";

export type Locale = keyof typeof messages;
export const messages = {en, ja,} as const;

function RootLayout() {
    return (
        <ManabiHudContainer>
            <Outlet />
        </ManabiHudContainer>
    );
}

export default function App() {

    const currentLanguage = getSavedLanguage();

    return (
        <AuthProvider>
            <IntlProvider
                locale={currentLanguage}
                messages={messages[currentLanguage]}
                defaultLocale="ja"
            >
                <Routes>
                    <Route path="/" element={<RootLayout />}>

                        <Route index element={<StartPage />} />

                        <Route element={<UnauthenticatedRoute/>}>
                            <Route path="register" element={<RegisterPage />} />
                        </Route>
                        <Route element={<UnauthenticatedRoute/>}>
                            <Route path="login" element={<LoginPage />} />
                        </Route>

                        <Route element={<AuthenticatedRoute />}>
                            <Route path="space" element={<UserSpace />} />
                        </Route>

                        <Route path="loading" element={<LoadingScreen />} />

                        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
                    </Route>
                </Routes>
            </IntlProvider>
        </AuthProvider>
    );
}