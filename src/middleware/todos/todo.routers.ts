import express from "express";
import { todoController } from "./todoes.controller";


const router = express.Router();


router.post('/',todoController.createTodo)
router.get('/',todoController.getAllTodos)
router.get('/:id',todoController.getTodoById)
router.put('/:id',todoController.updateTodo)
router.delete('/:id',todoController.deleteTodo)


export  const  todoRoutes = router;