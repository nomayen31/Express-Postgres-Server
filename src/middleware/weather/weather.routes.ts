import express from "express";
import { weatherController } from "./weather.controller";

const router = express.Router();


router.get("/", weatherController.getWeatherByCity);
router.get("/history", weatherController.getHistory);
router.get("/history/user", weatherController.getHistoryByUser);
router.get("/profile", weatherController.getWeatherProfile);

export const weatherRoutes = router;
