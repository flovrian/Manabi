import { Request, Response } from 'express';
import {getSessionData} from "../utils/Sessions.ts";

export async function RetrieveSession(
    req: Request,
    res: Response,
): Promise<void> {
    const sessionToken = req.cookies?.manabi_session;

    if (typeof sessionToken !== 'string') {
        res.status(401).json({ error: "No active session" });
        return;
    }
    const sessionData = await getSessionData(sessionToken);
    if (!sessionData) {
        res.status(400).json({ error: "Invalid session" });
        return;
    }
    res.status(200).json({
        user_id: sessionData.user_id,
        role: sessionData.role
    });
    return;
}