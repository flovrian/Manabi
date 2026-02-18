import {Userdata} from "../db/queries/Users.ts";
import {addSessionToCache, getSessionFromCache, removeSessionFromCache} from "../redis/queries/Sessions.ts";
import {
    createSession,
    deleteOldestSession,
    deleteSession,
    getSession,
    getSessionCount
} from "../db/queries/Sessions.ts";

import platformJS from 'platform'
import crypto from 'crypto';
import dotenv = require("dotenv");

dotenv.config();

export const DB_SESSION_LIFETIME_SECONDS = 30 * 86400;
export const CACHED_SESSION_LIFETIME_SECONDS = 7 * 86400;
const MAX_SESSION_COUNT_PER_USER = 5;

export type SessionData = {
    user_id : string;
    role: number;
    device_type : string | null;
    created_at: Date;
    last_used: Date;
    expires_at: Date;
}

export type DeviceInformation = {
    name: string,
    version: string,
    os: string
}

export async function generateSession(userData : Userdata, deviceType : string | null) : Promise<string | null > {
    const rawSessionToken = generateSessionToken();
    const expiryDate = new Date(Date.now() + DB_SESSION_LIFETIME_SECONDS * 1000);

    if(await getSessionCount(userData.user_id) >= MAX_SESSION_COUNT_PER_USER){
        await deleteOldestSession(userData.user_id);
    }

    const isCreationSuccess = await createSession(
        userData.user_id,
        userData.role,
        rawSessionToken,
        expiryDate,
        deviceType
    )
    if(!isCreationSuccess) {
        return null;
    }
    await addSessionToCache(userData.user_id, userData.role, rawSessionToken, expiryDate, deviceType);
    return rawSessionToken;
}

export async function getSessionData(sessionToken : string ) : Promise<SessionData | null>{
    const cachedSessionData = await getSessionFromCache(sessionToken);
    if(cachedSessionData !== null) {
        return cachedSessionData;
    }
    const dbSessionData = await getSession(sessionToken);
    if(dbSessionData === null) {
        return null;
    }
    await addSessionToCache(
        dbSessionData.user_id,
        dbSessionData.role,
        sessionToken,
        dbSessionData.expires_at,
        dbSessionData.device_type
    )
    return dbSessionData;
}

async function deleteSessionData(sessionToken : string) : Promise<void> {
    await deleteSession(sessionToken);
    await removeSessionFromCache(sessionToken);
}

export function hashSessionToken(sessionToken : string) : string {
    return crypto
        .createHash("sha256")
        .update(sessionToken)
        .digest("hex");
}

function generateSessionToken() : string { return crypto.randomBytes(32).toString("base64url"); }

export function getDeviceInformationByUserAgent(userAgent : string | undefined) : DeviceInformation {
    if (typeof userAgent !== "string" || userAgent.trim() === "") {
        return {
            name: "Unknown",
            version: "Unknown",
            os: "Unknown"
        };
    }
    try {
        const deviceInfo = platformJS.parse(userAgent);
        return {
            name: deviceInfo.name || "Unknown",
            version: deviceInfo.version || "Unknown",
            os: deviceInfo.os?.toString() || "Unknown"
        };
    } catch (err) {
        return {
            name: "Unknown",
            version: "Unknown",
            os: "Unknown"
        };
    }
}

module.exports = {
    generateSession,
    hashSessionToken,
    getSessionData,
    getDeviceInformationByUserAgent,
    DB_SESSION_LIFETIME_SECONDS,
    CACHED_SESSION_LIFETIME_SECONDS
}
