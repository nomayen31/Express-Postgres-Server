import express, { Request, Response } from "express";

import config from "./config";
import initDB from "./config/Db";
import logger from "./middleware/logger";
import { userRoutes } from "./middleware/users/user.routes";
import { todoRoutes } from "./middleware/todos/todo.routers";
import { weatherRoutes } from "./middleware/weather/weather.routes";
import { authRoutes } from "./middleware/auth/auth.router";

const app = express();
const port = config.port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello This is next level developer!");
});
// user routes
app.use("/users", userRoutes);

// todoRoutes 

app.use('/todos', todoRoutes)

// weather routes
app.use('/weather', weatherRoutes)

// auth routes
app.use('/auth', authRoutes)
// Not found route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

// Start server with async database initialization
const startServer = async () => {
  try {
    // Initialize DB first
    await initDB();
    console.log("Database initialized successfully");

    // Then start the server
    const serverPort = Number(port) || 5000;
    console.log(`Attempting to start server on port ${serverPort}...`);

    app.listen(serverPort, () => {
      console.log(`Example app listening on port ${serverPort}`);
    });
  } catch (error: any) {
    console.error("Failed to start server:", error.message);
    console.error("Error stack:", error.stack);
    process.exit(1);
  }
};

startServer();

// Trigger restart
