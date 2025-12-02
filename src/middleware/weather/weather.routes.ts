import express from "express";
import { weatherController } from "./weather.controller";

const router = express.Router();

router.get("/", weatherController.getWeatherByCity);

export const weatherRoutes = router;
