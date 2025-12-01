import express, { Request, Response } from "express";
import { pool } from "../../config/Db";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { name, email, age, phone, address } = req.body;
  try {
    const result = await pool.query(
      `
      INSERT INTO users(name , email , age , phone , address)
      VALUES($1 , $2 , $3 , $4 , $5) RETURNING *
    `,
      [name, email, age, phone, address]
    );
    console.log(result.rows[0]);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    console.log(result.rows);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Users not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: result.rows,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
})

export  const  userRoutes = router;