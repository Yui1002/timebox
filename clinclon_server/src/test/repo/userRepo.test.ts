import { Pool, PoolClient } from "pg";
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});

let client: PoolClient;

describe("test DB connection", () => {
    beforeEach(async () => {
        client = await pool.connect();
    });

    afterEach(() => {
        client.release();
    });

    test("should establish a successful db connection", async () => {
        let client = await pool.connect();
        // await expect(manager.verifyUser(req)).rejects.toThrow(exception);
        await expect(client).toBeTruthy();
        
    })
});