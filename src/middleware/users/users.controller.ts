import { Request, Response } from "express";
import { userService } from "./user.service";

export const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUser(
      req.body.name,
      req.body.email,
      req.body.age,
      req.body.phone,
      req.body.address,
      req.body.password
    );
    console.log(result);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsers();
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
}


export const getSingleUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getSingleUser(req.params.id as string);
    console.log(result.rows);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.updateUser(req.params.id as string, req.body.name, req.body.email, req.body.age, req.body.phone, req.body.address);
    console.log(result.rows);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.deleteUser(req.params.id as string);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}