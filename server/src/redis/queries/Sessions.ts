import redisClient from "../Redis.ts";
import {hashSessionToken, SessionData, CACHED_SESSION_LIFETIME_SECONDS} from "../../utils/Sessions.ts";

export async function addSessionToCache(
    userId: string,
    role: number,
    rawSessionToken: string,
    expiresAt: Date,
    deviceType: string | null
): Promise<void> {
    const currentDate = new Date()
    await redisClient.SET(
        `sess:${hashSessionToken(rawSessionToken)}`,
        JSON.stringify(
            {
                user_id: userId,
                role: role,
                device_type: deviceType,
                created_at : currentDate,
                last_used: currentDate,
                expires_at: expiresAt,
            }
        ), {EX: CACHED_SESSION_LIFETIME_SECONDS}
    )
}
export async function getSessionFromCache(rawSessionToken: string): Promise<SessionData | null> {
    const sessionData = await redisClient.GET(`sess:${hashSessionToken(rawSessionToken)}`);
    if(sessionData === null){
        return null;
    }
    const parsedSessionData = JSON.parse(sessionData);
    parsedSessionData.created_at = new Date(parsedSessionData.created_at);
    parsedSessionData.last_used_at = new Date(parsedSessionData.last_used_at);
    parsedSessionData.expires_at = new Date(parsedSessionData.expires_at);
    return parsedSessionData;
}

export async function removeSessionFromCache(rawSessionToken: string): Promise<void> {
    await redisClient.DEL(`sess:${hashSessionToken(rawSessionToken)}`)
}

module.exports = {
    addSessionToCache,
    removeSessionFromCache,
    getSessionFromCache
}