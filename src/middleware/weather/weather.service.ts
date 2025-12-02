import { Request, Response } from "express";
import { pool } from "../../config/Db";

const getCoordinates = async (city: string) => {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
        throw new Error("City not found");
    }
    return data.results[0];
};

const getWeather = async (lat: number, long: number) => {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m`);
    const data = await response.json();
    return data;
};

const getWeatherByCity = async (city: string, userId?: number) => {
    const coords = await getCoordinates(city);
    const weather = await getWeather(coords.latitude, coords.longitude);

    // Save to history
    await saveSearchHistory(
        coords.name,
        coords.country,
        weather.hourly.temperature_2m[0], // Saving current temp as example
        "Fetched",
        userId
    );

    return {
        city: coords.name,
        country: coords.country,
        latitude: coords.latitude,
        longitude: coords.longitude,
        weather
    };
};

const saveSearchHistory = async (city: string, country: string, temperature: number, condition: string, userId?: number) => {
    await pool.query(
        `INSERT INTO weather_history (city, country, temperature, condition, user_id) VALUES ($1, $2, $3, $4, $5)`,
        [city, country, temperature, condition, userId || null]
    );
};


const getSearchHistory = async () => {
    const result = await pool.query(`
        SELECT w.*, u.name as user_name 
        FROM weather_history w 
        LEFT JOIN users u ON w.user_id = u.id 
        ORDER BY w.created_at DESC
    `);
    return result.rows;
};

const getSearchHistoryByUser = async (userId: number) => {
    const result = await pool.query(`
        SELECT w.*, u.name as user_name 
        FROM weather_history w 
        LEFT JOIN users u ON w.user_id = u.id 
        WHERE w.user_id = $1
        ORDER BY w.created_at DESC
    `, [userId]);
    return result.rows;
};

export const weatherService = {
    getCoordinates,
    getWeather,
    getWeatherByCity,
    getSearchHistory,
    getSearchHistoryByUser
};
