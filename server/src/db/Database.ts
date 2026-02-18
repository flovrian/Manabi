import postgres from 'postgres'

import dotenv = require("dotenv");

dotenv.config();

const sql = postgres({
    host: process.env.DB_HOST || 'localhost',
    port: Number.parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'cheesecake',
    database: 'manabi_db',
});

const tableStatements = [
    {
        query: `CREATE TABLE IF NOT EXISTS users
                (
                    id            SERIAL PRIMARY KEY,
                    user_id       VARCHAR(20)       NOT NULL UNIQUE,
                    username      VARCHAR(20)       NOT NULL UNIQUE,
                    email         VARCHAR(255)      NOT NULL UNIQUE,
                    role          INTEGER DEFAULT 0 NOT NULL,
                    password_hash CHAR(60),
                    auth_provider VARCHAR(20) DEFAULT NULL
                )`
    },
    {
        query: `CREATE TABLE IF NOT EXISTS user_profiles
                (
                    id            SERIAL PRIMARY KEY,
                    user_id       VARCHAR(20)       NOT NULL REFERENCES users (user_id),
                    description   VARCHAR(45)       NULL,
                    country       SMALLINT          NULL
                )`
    },
    {
        query: `CREATE TABLE IF NOT EXISTS user_settings
                (
                    id            SERIAL PRIMARY KEY,
                    user_id       VARCHAR(20)       NOT NULL REFERENCES users (user_id),
                    theme         SMALLINT          NULL,
                    language      SMALLINT          NULL
                )`
    },
    {
        query: `CREATE TABLE IF NOT EXISTS sessions
                (
                    id          SERIAL PRIMARY KEY,
                    user_id     VARCHAR(20)             NOT NULL REFERENCES users (user_id),
                    role        INTEGER                 NOT NULL,
                    device_type TEXT      DEFAULT NULL,
                    token_hash  TEXT                    NOT NULL UNIQUE,
                    created_at  TIMESTAMP DEFAULT now() NOT NULL,
                    last_used   TIMESTAMP DEFAULT now() NOT NULL,
                    expires_at  TIMESTAMP               NOT NULL
                )`
    }
]

async function generateDatabaseSchema() {
    try {
        for (const tableStatement of tableStatements) {
            for (const [_, v] of Object.entries(tableStatement)) {
                await sql.unsafe(v);
            }
        }
    } catch (err) {
        await sql.end();
        throw err;
    }
}

generateDatabaseSchema().then(r => console.log(
    "Successfully created database schema.")
);


export default sql
