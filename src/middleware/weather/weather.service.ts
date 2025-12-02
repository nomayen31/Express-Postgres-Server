import { Request, Response } from "express";

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

const getWeatherByCity = async (city: string) => {
    const coords = await getCoordinates(city);
    const weather = await getWeather(coords.latitude, coords.longitude);
    return {
        city: coords.name,
        country: coords.country,
        latitude: coords.latitude,
        longitude: coords.longitude,
        weather
    };
};

export const weatherService = {
    getCoordinates,
    getWeather,
    getWeatherByCity
};
