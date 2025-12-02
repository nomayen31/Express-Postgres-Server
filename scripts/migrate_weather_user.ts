import { pool } from "../src/config/Db";

const migrate = async () => {
    try {
        console.log("Starting migration...");
        await pool.query(`
            ALTER TABLE weather_history 
            ADD COLUMN IF NOT EXISTS user_id INT REFERENCES users(id) ON DELETE SET NULL
        `);
        console.log("Migration successful: user_id column added to weather_history.");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await pool.end();
    }
};

migrate();
