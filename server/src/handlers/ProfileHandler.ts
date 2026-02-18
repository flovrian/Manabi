import { Request, Response } from 'express';
import {getUserdata} from "../db/queries/Users.ts";

export async function getProfileData (
    req: Request,
    res: Response,
): Promise<void> {

    const sessionToken = req.cookies?.manabi_session;
    if (typeof sessionToken !== 'string') {
        res.status(401).json({ error: "No active session" });
        return;
    }

    const { userId } = req.params;

    if (typeof userId !== "string") {
        res.status(401).json({ error: "Server Error" });
        return;
    }

    const profileData = await getUserdata('user_id', userId);
    if (!profileData) {
        res.status(404).json({ error: "No profile data found" });
        return;
    }
    res.status(200).json({
        username: profileData.username,
    });
    return;
}