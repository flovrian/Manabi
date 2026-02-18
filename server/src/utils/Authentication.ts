import {doesEmailExist, doesUsernameExist} from '../db/queries/Users.ts';
import {validate} from "isemail";
import redisClient from "../redis/Redis.ts";

let userIdSequence = 0n; // Amount of id's generated in same ms
let lastUserIdTimestamp = 0n; // Last id generation timestamp
const cachedStartingEpoch = BigInt(Date.UTC(
    2015, 0, 0, 0, 0, 1)
);

function getTimestamp() { return BigInt(Date.now()); }

export function generateUserId(workerId = 1n) : bigint {
    let userIdTimestamp = getTimestamp();
    /* If the last timestamp isn't unique generate a new one */
    if (userIdTimestamp === lastUserIdTimestamp) {
        /*
            0xFFF equals exactly  12 bits (4095) (11111111111).
            The '&' operator compares each bit, it turns all 1's into 0's if not both are 1's.
            (To never exceed 12 bits) in case it generated as much user id's in a millisecond
            The +1 bit makes sure the timestamp is truly unique.
        */
        userIdSequence = (userIdSequence + 1n) & 0xFFFn;
        if (userIdSequence === 0n) {
            while (userIdTimestamp <= lastUserIdTimestamp) {
                userIdTimestamp = getTimestamp();
            }
        }
    } else {
        userIdSequence = 0n;
    }

    lastUserIdTimestamp = userIdTimestamp;

    /*Shift timestamp 22 bits to left and make space for worker id + id sequence*/
    return (
        (
            (userIdTimestamp - cachedStartingEpoch) << 22n
        ) | (workerId  << 12n) | userIdSequence
    );
}

function extractTimestampFromUserId(userId: bigint): bigint {
    /* Shift 22 bits to the right in order to remove sequence + worker id */
    return cachedStartingEpoch + (userId >> 22n);
}


export interface ValidationResult {
    result: boolean;
    description: string;
    final : string  | null;
}

export async function validateUsername(username: unknown): Promise<ValidationResult> {
    if(typeof username !== "string"){
        return { result: false, description: "authentication.form.register.error.username_invalid", final: null };
    }
    const trimmedUsername = username.trim();
    if(trimmedUsername.length < 2 || trimmedUsername.length > 20){
        return { result: false, description: "authentication.form.register.error.username_length", final: null };
    }
    const finalUsername = trimmedUsername.toLowerCase();
    if(!/^[a-zA-Z][a-zA-Z0-9_]{1,19}$/.test(finalUsername)){
        return { result: false, description: "authentication.form.register.error.username_invalid", final: null };
    }
    try {
        const cachedUsername = await redisClient.GET(`username:${finalUsername}`);
        if (cachedUsername !== null) {
            return { result: false, description: "authentication.form.register.error.username_duplicate", final: null };
        }
        const existsInDb = await doesUsernameExist(finalUsername);
        if (existsInDb) {
            await redisClient.SET(`username:${finalUsername}`, "1", {NX: true, EX: 600 });
            return { result: false, description: "authentication.form.register.error.username_duplicate", final: null };
        }
        return { result: true, description: "", final: finalUsername };
    } catch (err) {
        console.error(err);
        return { result: false, description: "authentication.form.register.error.server", final: null  };
    }
}

export async function validateEmail(email: unknown, onLogin : boolean = false): Promise<ValidationResult> {
    if(typeof email !== "string"){
        return { result: false, description: "authentication.form.register.error.email_invalid", final: null };
    }
    const trimmedEmail = email.trim();
    if(trimmedEmail.length > 254){
        return { result: false, description: "authentication.form.register.error.email_length", final: null };
    }
    const finalEmail = trimmedEmail.toLowerCase();
    if(!validate(finalEmail)){
        return { result: false, description: "authentication.form.register.error.email_invalid", final: null };
    }
    try {
        const cachedEmail = await redisClient.GET(`email:${finalEmail}`);
        if (cachedEmail !== null) {
            if(onLogin){
                return { result: true, description: "", final: finalEmail };
            }
            return { result: false, description: "authentication.form.register.error.email_duplicate", final: null };
        }
        const existsInDb = await doesEmailExist(finalEmail);
        if (existsInDb) {
            if(onLogin){
                return { result: true, description: "", final: finalEmail };
            }
            await redisClient.SET(`email:${finalEmail}`, "1", {NX: true, EX: 600 });
            return { result: false, description: "authentication.form.register.error.email_duplicate", final: null };
        }
        if(onLogin){
            return { result: false, description: "", final: null };
        }
        return { result: true, description: "", final: finalEmail };
    } catch (err) {
        console.error(err);
        return { result: false, description: "authentication.form.register.error.server", final: null };
    }
}

export function validatePassword(password: unknown): ValidationResult {
    if(typeof password !== "string"){
        return { result: false, description: "authentication.form.register.error.password_invalid", final: null };
    }
    /* Bcrypt maxes out at around 50 */
    if(password.length > 50){
        return { result: false, description: "authentication.form.register.error.password_length", final: null };
    }
    if(!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{12,}$/.test(password)){
        return { result: false, description: "authentication.form.register.error.password_strength", final: null };
    }
    return { result: true, description: "", final: password };
}

module.exports = {
    validateUsername: validateUsername,
    validateEmail: validateEmail,
    validatePassword : validatePassword,
    generateUserId : generateUserId
};

