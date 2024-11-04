import { Request, Response } from 'express';
import User from '../models/user';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios.' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario.' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({ name, email, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el usuario.' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  try {
    const user = await User.findByPk(id);
    if (user) {
      user.name = name;
      user.email = email;
      user.password = password;
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario.' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
      res.json({ message: 'Usuario eliminado.' });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario.' });
  }
};
