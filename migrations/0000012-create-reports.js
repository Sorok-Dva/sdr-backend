'use strict';

const {DataTypes} = require("sequelize");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('reports', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userDreamId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'userDreams',
          key: 'id',
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      reason: {
        type: Sequelize.ENUM('inappropriate_content', 'copyright_violation', 'privacy_violation', 'hate_speech', 'spam', 'other'),
        allowNull: false,
      },
      solvedReason: {
        type: Sequelize.ENUM('inappropriate_content', 'copyright_violation', 'privacy_violation', 'hate_speech', 'spam', 'other'),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('Pending', 'Resolved'),
        allowNull: false,
        defaultValue: 'Pending',
      },
      adminId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('reports');
  },
};
