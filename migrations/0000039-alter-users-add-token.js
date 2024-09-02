'use strict';

const crypto = require('crypto');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'token', {
      type: Sequelize.STRING,
      allowNull: false,
      after: 'password'
    });

    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users',
      { type: Sequelize.QueryTypes.SELECT }
    );

    for (const user of users) {
      const token = crypto.randomBytes(20).toString('hex');
      await queryInterface.sequelize.query(
        `UPDATE users SET token = :token WHERE id = :id`,
        {
          replacements: { token, id: user.id },
          type: Sequelize.QueryTypes.UPDATE
        }
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'token');
  }
};
