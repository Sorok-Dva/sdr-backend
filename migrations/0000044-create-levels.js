const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('levels', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      level: {
        type: DataTypes.INTEGER,
        unique: true,
      },
      pointsRequired: {
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    await queryInterface.bulkInsert('levels', [
      { level: 1, pointsRequired: 0, title: 'Rêveur', createdAt: new Date(), updatedAt: new Date() },
      { level: 2, pointsRequired: 100, title: 'Explorateur Lucide', createdAt: new Date(), updatedAt: new Date() },
      { level: 3, pointsRequired: 250, title: 'Voyageur des Songes', createdAt: new Date(), updatedAt: new Date() },
      { level: 4, pointsRequired: 500, title: 'Gardien du Sommeil', createdAt: new Date(), updatedAt: new Date() },
      { level: 5, pointsRequired: 750, title: 'Architecte des Rêves', createdAt: new Date(), updatedAt: new Date() },
      { level: 6, pointsRequired: 1000, title: 'Chercheur de Réalité', createdAt: new Date(), updatedAt: new Date() },
      { level: 7, pointsRequired: 1500, title: 'Sage des Nuits', createdAt: new Date(), updatedAt: new Date() },
      { level: 8, pointsRequired: 2000, title: 'Méditant Nocturne', createdAt: new Date(), updatedAt: new Date() },
      { level: 9, pointsRequired: 3000, title: 'Voyant des Sphères', createdAt: new Date(), updatedAt: new Date() },
      { level: 10, pointsRequired: 4000, title: 'Alchimiste des Rêves', createdAt: new Date(), updatedAt: new Date() },
      { level: 11, pointsRequired: 5000, title: 'Maître des Dimensions', createdAt: new Date(), updatedAt: new Date() },
      { level: 12, pointsRequired: 6000, title: 'Tisseur de Réalités', createdAt: new Date(), updatedAt: new Date() },
      { level: 13, pointsRequired: 7500, title: 'Oracle du Ciel Nocturne', createdAt: new Date(), updatedAt: new Date() },
      { level: 14, pointsRequired: 9000, title: 'Conquérant des Limites', createdAt: new Date(), updatedAt: new Date() },
      { level: 15, pointsRequired: 11000, title: 'Philosophe du Rêve', createdAt: new Date(), updatedAt: new Date() },
      { level: 16, pointsRequired: 13000, title: 'Éclaireur des Mondes', createdAt: new Date(), updatedAt: new Date() },
      { level: 17, pointsRequired: 15000, title: 'Maître du Sommeil', createdAt: new Date(), updatedAt: new Date() },
      { level: 18, pointsRequired: 17500, title: 'Gardien des Mondes Intérieurs', createdAt: new Date(), updatedAt: new Date() },
      { level: 19, pointsRequired: 20000, title: 'Voyageur Interstellaire', createdAt: new Date(), updatedAt: new Date() },
      { level: 20, pointsRequired: 25000, title: 'Maître des Univers', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('levels');
  },
};
