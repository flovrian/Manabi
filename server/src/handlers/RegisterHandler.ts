import bcrypt from "bcryptjs";
import { Request, Response } from 'express';
import {
    ValidationResult,
    validateUsername,
    validateEmail,
    validatePassword,
    generateUserId
} from '../utils/Authentication.ts';
import {createNewUser} from "../db/queries/Users.ts";
import redisClient from "../redis/Redis.ts";

export async function RegisterUser(
    req: Request,
    res: Response,
): Promise<void> {

    const requestBody = req.body;

    const username = requestBody.username ?? null;
    const email = requestBody.email ?? null;
    const password = requestBody.password ?? null;

    const usernameValidationRes: ValidationResult = await validateUsername(username);
    if (!usernameValidationRes.result) {
        res.status(400).json({ errors: { username: usernameValidationRes.description } })
        return;
    }
    const emailValidationRes : ValidationResult = await validateEmail(email);
    if (!emailValidationRes.result) {
        res.status(400).json({ errors: { email: emailValidationRes.description } })
        return;
    }
    const passwordValidationRes : ValidationResult = validatePassword(password);
    if (!passwordValidationRes.result) {
        res.status(400).json({ errors: { password: passwordValidationRes.description } })
        return;
    }

    if(!usernameValidationRes.final || !emailValidationRes.final || !passwordValidationRes.final){
        res.status(400).json({ errors: { server: "authentication.form.register.error.server" } });
        return;
    }

    try{
        await createNewUser(
            generateUserId(),
            usernameValidationRes.final,
            emailValidationRes.final,
            await bcrypt.hash(
                passwordValidationRes.final,
                bcrypt.genSaltSync(10)
            ),
            ''
        );
        await redisClient.SET(`username:${username}`, "1", {NX: true, EX: 600 });
        await redisClient.SET(`email:${email}`, "1", {NX: true, EX: 600 });
    }
    catch(err){
        console.error(err);
        res.status(400).json({ errors: { server: "authentication.form.register.error.server" }  });
        return;
    }
    res.status(200).json({});
    return;
}