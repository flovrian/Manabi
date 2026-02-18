import sql from "../Database.ts";

export type Userdata = {
    user_id : string;
    username: string,
    email: string;
    role: number;
    password_hash : string | null;
    provider: string | null;
}


/** Retrieve a user by a specific key value
 * @var string key
 * @var string value
 */
export async function getUserdata(
    key: string,
    value: string
): Promise<Userdata | null> {
    const rows = await sql<Userdata[]>`
        SELECT *
        FROM users
        WHERE ${sql(key)} = ${value}
    `;
    return rows[0] ?? null;
}

export async function doesUsernameExist(username: string): Promise<boolean> {
    const res = await sql`
        SELECT 1
        FROM users
        WHERE username = ${username}
        LIMIT 1
    `;
    return res.length > 0;
}

export async function doesEmailExist(email: string): Promise<boolean> {
    const res = await sql`
        SELECT 1
        FROM users
        WHERE email = ${email}
        LIMIT 1
    `;
    return res.length > 0;
}

/** Insert a new user into the database
 * @var string userId
 */
export async function createNewUser(
    userId: bigint,
    username: string,
    email: string | null,
    passwordHash: string | null,
    authProvider: string | null
) {
    return sql`
        INSERT INTO users (user_id, username, email, password_hash, auth_provider)
        VALUES (
                   ${(userId).toString()},
                   ${username},
                   ${email},
                   ${passwordHash},
                   ${authProvider}
               )
        ON CONFLICT (user_id) DO NOTHING
    `;
}

module.exports = {
    doesUsernameExist,
    doesEmailExist,
    createNewUser,
    getUserdata,
};