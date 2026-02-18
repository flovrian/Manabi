import { Request, Response } from 'express';
import {hashSessionToken} from "../utils/Sessions.ts";
import {deleteSession} from "../db/queries/Sessions.ts";
import {removeSessionFromCache} from "../redis/queries/Sessions.ts";

export async function LogoutUser(
    req: Request,
    res: Response,
): Promise<void> {
    const sessionToken = req.cookies?.manabi_session;

    console.log("Received logout request");


    if (typeof sessionToken === 'string') {
        try {
            await Promise.all([
                deleteSession(sessionToken),
                removeSessionFromCache(sessionToken),
            ]);
        } catch (error) { console.error(error); }
    }
    res.clearCookie('manabi_session', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });
    res.status(200).json({});
}