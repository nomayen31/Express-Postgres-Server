import { Request, Response } from "express";
import { todoService } from "./todo.service";

const createTodo = async (req: Request, res: Response) => {
    const { title, description, completed, due_date, user_id } = req.body;

    try {
        const result = await todoService.createTodo(title, description, completed, due_date, user_id);

        res.status(201).json({
            success: true,
            message: "Todo created successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllTodos = async (req: Request, res: Response) => {
    try {
        const result = await todoService.getAllTodos();

        res.status(200).json({
            success: true,
            message: "Todos fetched successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getTodoById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await todoService.getTodoById(id);

        res.status(200).json({
            success: true,
            message: "Todo fetched successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateTodo = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, completed, due_date, user_id } = req.body;

    try {
        const result = await todoService.updateTodo(id, title, description, completed, due_date, user_id);

        res.status(200).json({
            success: true,
            message: "Todo updated successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteTodo = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await todoService.deleteTodo(id);

        res.status(200).json({
            success: true,
            message: "Todo deleted successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const todoController = {
    createTodo,
    getAllTodos,
    getTodoById,
    updateTodo,
    deleteTodo
};