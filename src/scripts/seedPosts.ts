import sequelize from '../database';
import Post from '../models/post';
import User from '../models/user';
import { faker } from '@faker-js/faker';

const seedPosts = async () => {
  try {
    const users = await User.findAll({ attributes: ['id'] });

    if (users.length === 0) {
      console.error('No hay usuarios disponibles para asignar posts');
      return;
    }

    const posts = [];
    const totalPosts = 15000;
    for (let i = 0; i < totalPosts; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      posts.push({
        title: faker.lorem.sentence(),
        content: faker.lorem.lines(),
        userId: randomUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await Post.bulkCreate(posts);

    console.log('Se insertaron 15,000 posts correctamente');
  } catch (error) {
    console.error('Error al insertar posts:', error);
  } finally {
    await sequelize.close();
  }
};

seedPosts();
