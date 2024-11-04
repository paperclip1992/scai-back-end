import sequelize from '../database';
import User from '../models/user';
import { faker } from '@faker-js/faker';

const seedUsers = async () => {
  try {
    // Generar un set para asegurarnos de que los correos sean únicos
    const emailsSet = new Set<string>();
    const users = [];

    while (emailsSet.size < 5000) {
      const email = faker.internet.email();
      if (!emailsSet.has(email)) {
        emailsSet.add(email);
        users.push({
          name: faker.person.firstName(),
          email: email,
          password: faker.internet.password(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    // Inserción masiva
    await User.bulkCreate(users);

    console.log('Se insertaron 5000 usuarios correctamente');
  } catch (error) {
    console.error('Error al insertar usuarios:', error);
  } finally {
    await sequelize.close();
  }
};

seedUsers();
