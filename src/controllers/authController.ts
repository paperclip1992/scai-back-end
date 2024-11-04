import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const secretKey = "mySuperSecretKey";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya está registrado.' });
    }
    const hashedPassword = await bcrypt.hash(password, 2);
    const newUser = await User.create({ name, email, password: hashedPassword });
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, secretKey);
    res.status(201).json({ token, user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario.' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta.' });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, secretKey);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión.' });
  }
};

export const authenticate = (req: Request, res: Response, next: any) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado, token faltante.' });
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido.' });
  }
};
