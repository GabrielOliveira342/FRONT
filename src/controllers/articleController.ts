import { Request, Response } from 'express';
import { db } from '../config/db';

export const createArticle = async (req: any, res: any) => {
  const { title, content, image } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ message: 'Não autorizado' });

const [result]: any = await db.query(
  'INSERT INTO articles (title, content, image, user_id) VALUES (?, ?, ?, ?)',
  [title, content, image, userId]
);
console.log(result)
const articleId = result.insertId;

res.status(201).json({
  message: 'Artigo criado com sucesso',
  id: articleId
});
};

export const getArticles = async (_req: Request, res: Response) => {
  const [articles]: any = await db.query(
    'SELECT articles.*, users.name as author FROM articles JOIN users ON articles.user_id = users.id'
  );
  console.log(articles)
  res.json(articles);
};

export const getArticleById = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const [rows]: any = await db.query(
      'SELECT articles.*, users.name as author FROM articles JOIN users ON articles.user_id = users.id WHERE articles.id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Artigo não encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar artigo por ID:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const updateArticle = async (req: any, res: any) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const image = req.file?.filename;

  const fields = [];
  const values: any[] = [];

  if (title) { fields.push('title = ?'); values.push(title); }
  if (content) { fields.push('content = ?'); values.push(content); }
  if (image) { fields.push('image = ?'); values.push(image); }

  if (fields.length === 0) return res.status(400).json({ message: 'Nada para atualizar' });

  values.push(id);

  const [result]: any = await db.query(
  `UPDATE articles SET ${fields.join(', ')} WHERE id = ?`,
  values
);
const articleId = id;
const [rows]: any = await db.query('SELECT id, title, content, image FROM articles WHERE id = ?', [articleId]);

res.json({ message: 'Artigo atualizado com sucesso', updatedArticle: rows[0] });
};

export const deleteArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  await db.query('DELETE FROM articles WHERE id = ?', [id]);
  res.json({ message: 'Artigo deletado com sucesso' });
};