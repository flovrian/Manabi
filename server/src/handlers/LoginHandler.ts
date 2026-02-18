import bcrypt from "bcryptjs";
import { Request, Response } from 'express';
import {validateEmail, validatePassword, ValidationResult} from "../utils/Authentication.ts";
import {getUserdata} from "../db/queries/Users.ts";
import {
    CACHED_SESSION_LIFETIME_SECONDS,
    generateSession,
    getDeviceInformationByUserAgent,
    getSessionData
} from "../utils/Sessions.ts";
import {getSession} from "../db/queries/Sessions.ts";

export async function LoginUser(
    req: Request,
    res: Response,
): Promise<void> {

    const requestBody = req.body;
    const email= requestBody.email;
    const password= requestBody.password;

    const emailValidationRes : ValidationResult = await validateEmail(email, true);
    if(!emailValidationRes.result){
        res.status(400).json({ errors: {
                email: "authentication.form.login.invalid_credentials",
                password: "authentication.form.login.invalid_credentials",
        } })
        return;
    }

    const passwordValidationRes : ValidationResult =  validatePassword(password);
    if(!passwordValidationRes.result){
        res.status(400).json({ errors: {
            email: "authentication.form.login.invalid_credentials",
            password: "authentication.form.login.invalid_credentials",
            }
        })
        return;
    }

    if(!passwordValidationRes.final || !emailValidationRes.final){
        res.status(400).json({ errors: { server: "authentication.form.register.error.server" } })
        return;
    }

    const userData = await getUserdata('email', emailValidationRes.final);
    if(userData === null){
        res.status(400).json({ errors: { server: "authentication.form.register.error.server" } })
        return;
    }

    /* In case the user registered with O-Auth and no password is set.*/
    if(userData.password_hash === null) {
        if(userData.provider !== null){
            res.status(400).json({ errors: { server: "authentication.form.login.oauth_required" } })
            return;
        }
        res.status(400).json({ errors: { server: "authentication.form.register.error.server" } })
        return;
    }

    try{
       const isMatching = await bcrypt.compare(
           passwordValidationRes.final,
           userData.password_hash
       );

       if(isMatching){

           const activeSessionToken = req.cookies?.manabi_session;
           if (typeof activeSessionToken === 'string') {
               const sessionData = await getSessionData(activeSessionToken);
               if (sessionData) {
                   res.status(200).json({
                       user_id: sessionData.user_id,
                       role: sessionData.role
                   });
                   return;
               }
           }

           const deviceInformation = getDeviceInformationByUserAgent(req.headers['user-agent']);
           const sessionToken = await generateSession(
               userData,
               `${deviceInformation.os} - ${deviceInformation.name}`
           );

           if(sessionToken === null) {
               res.status(400).json({errors: {server: "authentication.form.register.error.server"}})
               console.error("Failed to generate session and receive session token, cancelling login.");
               return;
           }

           const sessionData = await getSessionData(sessionToken);
           if(sessionData === null){
               res.status(400).json({errors: {server: "authentication.form.register.error.server"}})
               console.error("Failed to retrieve session data, cancelling login.");
               return;
           }
           res.cookie(
               'manabi_session',
               sessionToken,
               {
                   httpOnly: true,
                   secure: process.env.NODE_ENV === 'production',
                   sameSite: 'lax',
                   path: '/',
                   maxAge: CACHED_SESSION_LIFETIME_SECONDS * 1000
               }
           );
           res.status(200).json({
               user_id: sessionData.user_id,
               role: sessionData.role
           });

       }
    }catch (err) {
        res.status(400).json({errors: {server: "authentication.form.register.error.server"}})
        console.error(err);
    }
}