import { Request, Response } from "express";
import { weatherService } from "./weather.service";

const getWeatherByCity = async (req: Request, res: Response) => {
    const { city } = req.query;

    if (!city || typeof city !== 'string') {
        return res.status(400).json({
            success: false,
            message: "City name is required as a query parameter (e.g., ?city=London)"
        });
    }

    try {
        const result = await weatherService.getWeatherByCity(city);
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

export const weatherController = {
    getWeatherByCity
};
