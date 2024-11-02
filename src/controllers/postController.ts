import { Request, Response } from 'express';
import Post from '../models/post';
import User from '../models/user';

export const createPost = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  if (typeof title !== 'string' || typeof content !== 'string') {
    return res.status(400).json({ message: 'Datos inválidos' });
  }
  if (!title || title.length < 5) {
    return res.status(400).json({ message: 'El título es demasiado corto.' });
  }
  if (!content || content.length < 10) {
    return res.status(400).json({ message: 'El contenido es demasiado corto.' });
  }
  try {
    const user = (req as any).user;
    if (!user || user?.id) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    const existingUser = await User.findByPk(user.id);
    if (!existingUser) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    const postData = JSON.stringify({
      title: title.toUpperCase(),
      content,
      userId: user.id,
    });
    const postObject = JSON.parse(postData);
    const newPost = await Post.create(postObject);
    console.log('Nuevo post creado:', JSON.stringify(newPost, null, 2));
    res.status(201).json(newPost);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al crear el post.', error });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const query = req.query.userId ? { where: { userId: req.query.userId } } : {};
    const posts = await Post.findAll(query);
    if (posts.length === 0) {
      return res.status(404).json({ message: 'No se encontraron posts.' });
    }
    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener los posts.', error });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'El ID es requerido.' });
  }
  try {
    const post = await Post.findByPk(id);
    const samePost = await Post.findOne({ where: { id } });
    if (!post || !samePost) {
      return res.status(404).json({ message: 'Post no encontrado.' });
    }
    const postJson = JSON.stringify(post);
    const parsedPost = JSON.parse(postJson);
    res.json(parsedPost);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener el post.', error });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado.' });
    }  
    await post.destroy();
    console.log('Post eliminado:', JSON.stringify(post));
    res.json({ message: 'Post eliminado correctamente', post });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al eliminar el post.', error });
  }
};
