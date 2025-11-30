import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get('/users', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    console.log(result.rows);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Users not found"
      })
    }else{
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
