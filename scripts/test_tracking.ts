import { pool } from "../src/config/Db";

const testUserTracking = async () => {
    try {
        // 1. Create a user
        const userRes = await pool.query(`
            INSERT INTO users (name, email, age, phone, address) 
            VALUES ('Test User', 'test@example.com', 30, '1234567890', 'Test Address') 
            RETURNING id, name
        `);
        const user = userRes.rows[0];
        console.log("Created user:", user);

        // 2. Simulate search request (we can't easily call the controller here without mocking req/res, 
        // so we'll just call the service directly or use curl. Let's use curl for end-to-end test)
        console.log(`Run this command: curl "http://localhost:5000/weather?city=Berlin&userId=${user.id}"`);

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
};

testUserTracking();
