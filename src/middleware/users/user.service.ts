// src/services/user.service.ts
import { pool } from "../../config/Db";
import bcrypt from "bcrypt";
import { QueryResult } from "pg";

type UserRow = {
  id?: number;
  name: string;
  email: string;
  age: number;
  phone: string;
  address: string;
  password?: string;
  role?: string;
  created_at?: string;
};

const createUser = async (
name: string, email: string, age: number, phone: string, address: string, password: string, role: string): Promise<UserRow> => {
  // Basic validation (expand as needed)
  if (!password) throw new Error("Password is required");
  if (!email) throw new Error("Email is required");

  // optional: check uniqueness
  const exists = await pool.query("SELECT id FROM users WHERE email = $1", [
    email,
  ]);
  if (exists.rows.length) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
    INSERT INTO users (name, email, age, phone, address, password, role)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `,
    [name, email, age, phone, address, hashedPassword, role]
  );

  return result.rows[0];
};

const getAllUsers = async (): Promise<QueryResult<UserRow>> => {
  const result = await pool.query("SELECT id, name, email, age, phone, role,  address, created_at FROM users");
  return result;
};

const getSingleUser = async (id: string): Promise<QueryResult<UserRow>> => {
  const result = await pool.query(
    `SELECT id, name, email, age, phone, address, role ,  created_at FROM users WHERE id = $1`,
    [id]
  );
  return result;
};

const updateUser = async (
  id: string,
  name?: string,
  email?: string,
  age?: number,
  phone?: string,
  address?: string,
  password?: string,
  role?: string
): Promise<QueryResult<UserRow>> => {
  // Fetch current user
  const existing = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  if (!existing.rows.length) throw new Error("User not found");

  const current = existing.rows[0];

  // Prepare values: if a field is not provided, keep the current value
  const newName = name ?? current.name;
  const newEmail = email ?? current.email;
  const newAge = age ?? current.age;
  const newPhone = phone ?? current.phone;
  const newAddress = address ?? current.address;
  const newRole = role ?? current.role;

  // Only hash if password provided
  const newPassword = password ? await bcrypt.hash(password, 10) : current.password;

  const result = await pool.query(
    `
    UPDATE users
    SET name = $1, email = $2, age = $3, phone = $4, address = $5, password = $6, role = $7
    WHERE id = $8
    RETURNING id, name, email, age, phone, address, created_at
  `,
    [newName, newEmail, newAge, newPhone, newAddress, newPassword, role, id]
  );

  return result;
};

const deleteUser = async (id: string): Promise<QueryResult<UserRow>> => {
  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING id, name, email, age, phone, address, created_at`,
    [id]
  );
  return result;
};

export const userService = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
