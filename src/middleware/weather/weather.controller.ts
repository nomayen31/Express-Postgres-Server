import { Request, Response } from "express";
import { weatherService } from "./weather.service";

const getWeatherByCity = async (req: Request, res: Response) => {
    const { city, userId } = req.query;

    if (!city || typeof city !== 'string') {
        return res.status(400).json({
            success: false,
            message: "City name is required as a query parameter (e.g., ?city=London)"
        });
    }

    try {
        const result = await weatherService.getWeatherByCity(city, userId ? Number(userId) : undefined);
        res.status(200).json({
            success: true,
            message: "Weather fetched successfully",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getHistory = async (req: Request, res: Response) => {
    try {
        const result = await weatherService.getSearchHistory();
        res.status(200).json({
            success: true,
            message: "Search history fetched successfully",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getHistoryByUser = async (req: Request, res: Response) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "userId query parameter is required"
        });
    }
    try {
        const result = await weatherService.getSearchHistoryByUser(Number(userId));
        res.status(200).json({
            success: true,
            message: "User search history fetched successfully",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getWeatherProfile = (req: Request, res: Response) => {
    res.sendFile('weather-profile.html', { root: './public' });
};

export const weatherController = {
    getWeatherByCity,
    getHistory,
    getHistoryByUser,
    getWeatherProfile
};
