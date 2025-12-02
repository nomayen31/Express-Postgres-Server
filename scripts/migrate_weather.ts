import { pool } from "../src/config/Db";

const migrate = async () => {
    try {
        console.log("Starting migration...");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS weather_history(
                id SERIAL PRIMARY KEY,
                city VARCHAR(100) NOT NULL,
                country VARCHAR(100),
                temperature FLOAT,
                condition VARCHAR(255),
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);
        console.log("Migration successful: weather_history table created.");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await pool.end();
    }
};

migrate();
