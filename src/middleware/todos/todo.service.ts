import { pool } from "../../config/Db";

const createTodo = async (title: string, description: string, completed: boolean, due_date: string, user_id: string) => {
    const result = await pool.query(
        `
      INSERT INTO todos(title , description , completed , due_date , user_id)
      VALUES($1 , $2 , $3 , $4 , $5) RETURNING *
    `,
        [title, description, completed, due_date, user_id]
    );
    return result.rows[0];
};

const getAllTodos = async () => {
    const result = await pool.query('SELECT * FROM todos');
    return result.rows;
};

const getTodoById = async (id: string) => {
    const result = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
    return result.rows[0];
};

const updateTodo = async (id: string, title: string, description: string, completed: boolean, due_date: string, user_id: string) => {
    const result = await pool.query(
        `
      UPDATE todos
      SET title = $2, description = $3, completed = $4, due_date = $5, user_id = $6
      WHERE id = $1 RETURNING *
    `,
        [id, title, description, completed, due_date, user_id]
    );
    return result.rows[0];
};

const deleteTodo = async (id: string) => {
    const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

export const todoService = {
    createTodo,
    getAllTodos,
    getTodoById,
    updateTodo,
    deleteTodo
};