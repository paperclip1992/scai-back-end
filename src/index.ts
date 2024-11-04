import express from 'express';
import cors from 'cors';
import sequelize from './database';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

sequelize.sync({alter: true}).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
