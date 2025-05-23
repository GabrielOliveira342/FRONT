import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import articleRoutes from './routes/articleRoutes';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/auth', authRoutes);
app.use('/articles', articleRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});