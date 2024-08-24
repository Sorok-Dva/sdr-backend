'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'level', {
      type: Sequelize.INTEGER,
      defaultValue: 1,
      allowNull: false,
      after: 'points'
    });

    await queryInterface.addColumn('users', 'title', {
      type: Sequelize.STRING,
      defaultValue: 'Rêveur',
      allowNull: true,
      after: 'level'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'level');
    await queryInterface.removeColumn('users', 'title');
  }
};
