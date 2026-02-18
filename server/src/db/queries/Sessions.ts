import sql from "../Database.ts";
import {
    hashSessionToken,
    SessionData
} from "../../utils/Sessions.ts";

/** Create a new session with given data.
 * @var SessionData sessionData
 */
export async function createSession(
    userId: string,
    role: number,
    rawSessionToken: string,
    expiresAt: Date,
    deviceType: string | null
): Promise<boolean> {
    try {
        await sql`
            INSERT INTO sessions (user_id, role, device_type, token_hash, expires_at)
            VALUES (${userId},
                    ${role},
                    ${deviceType || null},
                    ${hashSessionToken(rawSessionToken)},
                    ${expiresAt})
        `;
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

/** Create a new session with given data.
 * @var SessionData sessionData
 */
export async function getSession(rawSessionToken: string): Promise<SessionData | null> {
    const rows = await sql<SessionData[]>`
        SELECT user_id,
               role,
               device_type,
               created_at,
               last_used,
               expires_at
        FROM sessions
        WHERE token_hash = ${hashSessionToken(rawSessionToken)}
    `
    if (rows.length === 0) {
        return null;
    }
    return rows[0];
}

export async function getSessionCount(userId: string): Promise<number> {
    const [{count}] = await sql`
        SELECT COUNT(*)
        FROM sessions
        WHERE user_id = ${userId};
    `
    return Number(count)
}

export async function deleteOldestSession(userId: string): Promise<void> {
    await sql`
        DELETE
        FROM sessions
        WHERE id = (SELECT id
                    FROM sessions
                    WHERE user_id = ${userId}
                    ORDER BY created_at ASC
            LIMIT 1
            )
    `
}


/** Attempt to delete a session.
 * @var string sessionToken
 */
export async function deleteSession(rawSessionToken: string): Promise<void> {
    await sql`DELETE
              FROM sessions
              WHERE token_hash = ${hashSessionToken(rawSessionToken)}`;
}
