'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'oldEmail', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'email'
    });

    await queryInterface.addColumn('users', 'lastNicknameChange', {
      type: Sequelize.DATE,
      allowNull: true,
      after: 'resetPasswordExpires'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'oldEmail');
    await queryInterface.removeColumn('users', 'lastNicknameChange');
  }
};
