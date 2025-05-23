import { Request, Response } from 'express';
import { db } from '../config/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  const [rows] = await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashed]);

  res.status(201).json({ message: 'Usuário registrado com sucesso' });
};

export const login = async (req: any, res: any) => {
  const { email, password } = req.body;

  const [results]: any = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  const user = results[0];
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Senha inválida' });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
};
