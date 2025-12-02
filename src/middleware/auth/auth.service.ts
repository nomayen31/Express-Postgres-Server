// src/services/auth.service.ts
import { pool } from "../../config/Db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

type UserRow = {
    id: number;
    name: string;
    email: string;
    age?: number;
    phone?: string;
    address?: string;
    password?: string;
    created_at?: string;
};

const loginUser = async (email: string, password: string) => {
    // 1) fetch user
    const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (!userRes.rows.length) throw new Error("User not found");

    const userRow: UserRow = userRes.rows[0];

    // 2) verify password
    const isPasswordMatch = await bcrypt.compare(password, userRow.password ?? "");
    if (!isPasswordMatch) throw new Error("Invalid password");

    // 3) create JWT payload and sign token
    const payload = { id: userRow.id, email: userRow.email };
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined in env");

    const expiresIn: string = process.env.JWT_EXPIRES_IN ?? "1h"; // e.g. "1h" or "7d"
    const token = jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);

    // 4) remove password before returning
    // create shallow clone so we don't mutate DB row
    const { password: _pwd, ...safeUser } = userRow;

    return {
        user: safeUser,
        token,
    };
};

export const authService = {
    loginUser,
};
