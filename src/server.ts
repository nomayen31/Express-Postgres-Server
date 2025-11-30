import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
dotenv.config({ path: path.join(process.cwd(), ".env") });
const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express Postgres API",
      version: "1.0.0",
      description: "A simple Express API with PostgreSQL",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ["./src/server.ts"], // files containing annotations as above
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STR}`
})



const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      age INT,
      phone VARCHAR(15),
      address TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos(
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT false,
      due_date DATE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
};

initDB();


app.get("/", (req: Request, res: Response) => {
  res.send("Hello This is next level developer!");
});

// user routes 
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               age:
 *                 type: integer
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       500:
 *         description: Server error
 */
app.post('/users', async (req: Request, res: Response) => {
  const { name, email, age, phone, address } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO users(name , email , age , phone , address)
      VALUES($1 , $2 , $3 , $4 , $5) RETURNING *
    `, [name, email, age, phone, address]);
    console.log(result.rows[0]);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result.rows[0]
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *       404:
 *         description: Users not found
 *       500:
 *         description: Server error
 */
app.get('/users', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    console.log(result.rows);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Users not found"
      })
    } else {
      res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: result.rows
      })
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User fetched successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
app.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    } else {
      res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: result.rows[0]
      })
    }
    console.log(result.rows);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               age:
 *                 type: integer
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
app.put('/users/:id', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`UPDATE users SET name = $1, email = $2, age = $3, phone = $4, address = $5 WHERE id = $6 RETURNING *`, [req.body.name, req.body.email, req.body.age, req.body.phone, req.body.address, req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    } else {
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result.rows[0]
      })
    }
    console.log(result.rows);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
app.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [req.params.id]);
    console.log(result);
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: result.rows[0]
      })
    }
    console.log(result.rows);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - user_id
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               due_date:
 *                 type: string
 *                 format: date
 *               user_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Todo created successfully
 *       500:
 *         description: Server error
 */
app.post('/todos', async (req: Request, res: Response) => {
  const { title, description, completed, due_date, user_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO todos(title, description, completed, due_date, user_id)
       VALUES($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, description, completed, due_date, user_id]
    );

    return res.status(201).json({
      success: true,
      message: "Todo created successfully",
      data: result.rows[0]
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Get all todos
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: Todos fetched successfully
 *       404:
 *         description: Todos not found
 *       500:
 *         description: Server error
 */
app.get('/todos', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos`);
    console.log(result.rows);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Todos not found"
      })
    } else {
      res.status(200).json({
        success: true,
        message: "Todos fetched successfully",
        data: result.rows
      })
    }
    console.log(result.rows);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: Get a todo by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The todo ID
 *     responses:
 *       200:
 *         description: Todo fetched successfully
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Server error
 */
app.get('/todos/:id', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos WHERE id = $1`, [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Todo not found"
      })
    } else {
      res.status(200).json({
        success: true,
        message: "Todo fetched successfully",
        data: result.rows[0]
      })
    }
    console.log(result.rows);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Update a todo
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               due_date:
 *                 type: string
 *                 format: date
 *               user_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Server error
 */
app.put('/todos/:id', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`UPDATE todos SET title = $1, description = $2, completed = $3, due_date = $4, user_id = $5 WHERE id = $6 RETURNING *`, [req.body.title, req.body.description, req.body.completed, req.body.due_date, req.body.user_id, req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Todo not found"
      })
    } else {
      res.status(200).json({
        success: true,
        message: "Todo updated successfully",
        data: result.rows[0]
      })
    }
    console.log(result.rows);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The todo ID
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Server error
 */
app.delete('/todos/:id', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`DELETE FROM todos WHERE id = $1 RETURNING *`, [req.params.id]);
    console.log(result);
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Todo not found"
      })
    } else {
      res.status(200).json({
        success: true,
        message: "Todo deleted successfully",
        data: result.rows[0]
      })
    }
    console.log(result.rows);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
