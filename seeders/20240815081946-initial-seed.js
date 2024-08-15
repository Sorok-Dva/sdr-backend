'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Roles
    const roles = await queryInterface.bulkInsert('Roles', [
      { name: 'Admin', createdAt: new Date(), updatedAt: new Date() },
      { name: 'User', createdAt: new Date(), updatedAt: new Date() },
    ], { returning: true });

    // Users
    const users = await queryInterface.bulkInsert('Users', [
      { username: 'admin', email: 'admin@example.com', roleId: roles[0].id, createdAt: new Date(), updatedAt: new Date() },
      { username: 'john_doe', email: 'john@example.com', roleId: roles[1].id, createdAt: new Date(), updatedAt: new Date() },
    ], { returning: true });

    // Tutorials
    const tutorials = await queryInterface.bulkInsert('Tutorials', [
      { title: 'How to Master Lucid Dreaming', content: 'Lorem ipsum...', userId: users[1].id, createdAt: new Date(), updatedAt: new Date() },
      { title: 'The Science of Dreams', content: 'Lorem ipsum...', userId: users[1].id, createdAt: new Date(), updatedAt: new Date() },
    ], { returning: true });

    // Comments
    await queryInterface.bulkInsert('Comments', [
      { userId: users[1].id, tutorialId: tutorials[0].id, content: 'Great tutorial!', upvote: 10, createdAt: new Date(), updatedAt: new Date() },
      { userId: users[1].id, tutorialId: tutorials[1].id, content: 'Very informative.', upvote: 5, createdAt: new Date(), updatedAt: new Date() },
    ]);

    // User Dreams
    await queryInterface.bulkInsert('UserDreams', [
      { userId: users[1].id, title: 'Flying Dream', description: 'I was flying over mountains...', privacy: 'private', views: 0, createdAt: new Date(), updatedAt: new Date() },
      { userId: users[1].id, title: 'Ocean Dream', description: 'I was swimming in a deep ocean...', privacy: 'public', views: 10, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('UserDreams', null, {});
    await queryInterface.bulkDelete('Comments', null, {});
    await queryInterface.bulkDelete('Tutorials', null, {});
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
