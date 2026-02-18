import {Locale} from '../App';
import {config} from "../../config";

const SUPPORTED_LANGUAGES = ["en", "ja"];

export type ProfileData = {
    username: string;
};
export type UserData = {
    sessionData: SessionData;
    profileData: ProfileData
};
export type SessionData = {
    user_id : string;
    role: number
}

export async function getProfileData(userId : string): Promise<ProfileData | null>  {
    const response = await fetch(`${config.apiUrl}/user/${userId}`, {
        method: "GET",
        credentials: "include",
    });
    if (!response.ok) {
        return null;
    }
    return await response.json();
}

export async function fetchProfileAvatar(userId : string) : Promise<string | null> {
    const res = await fetch(`api/user/avatar/${userId}`);
    const data = await res.json();
    return data.avatarUrl;
}

export async function getUserSession(): Promise<SessionData | null> {
    const response = await fetch(`${config.apiUrl}/session`, {
        method: "GET",
        credentials: "include",
    });
    if (!response.ok) {
        return null;
    }
    return await response.json();
}

export function getSavedLanguage(): Locale {
    let selectedLanguage = localStorage.getItem("manabi-language");
    if (!selectedLanguage || !SUPPORTED_LANGUAGES.includes(selectedLanguage as Locale)) {
        selectedLanguage = (navigator.language || "ja").split("-")[0];
    }
    if (!SUPPORTED_LANGUAGES.includes(selectedLanguage as Locale)) {
        return "ja";
    }
    return selectedLanguage as Locale;
}
