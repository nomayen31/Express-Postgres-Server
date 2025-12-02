import { pool } from "../src/config/Db";

const checkUsers = async () => {
    try {
        const res = await pool.query("SELECT * FROM users");
        console.log("Users:", res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
};

checkUsers();
