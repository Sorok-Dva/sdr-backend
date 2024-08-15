const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('categories', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    });

    await queryInterface.bulkInsert('categories', [
      {
        title: 'Rêve Lucide',
        description: '- Techniques pour devenir lucide dans ses rêves\n- Conseils pour maintenir la lucidité',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Interprétation des Rêves',
        description: '- Symbolisme des rêves\n- Signification des rêves récurrents\n- Méthode d\'interprétation des rêves',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Techniques de Souvenir des Rêves',
        description: '- Journaux de rêves\n- Technique de rappel des rêves\n- Exercices pour améliorer la mémoire des rêves',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Rêves et Méditation',
        description: '- La méditation dans la pratique du rêve lucide\n- Relaxation et préparation avant le sommeil\n- Visualisation et rêves',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Exploration des rêves',
        description: '- Voyage onirique\n- Découverte de nouveaux mondes dans les rêves',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Rêves Thématiques',
        description: '- Rêves d\'aventures\n- Rêves récurrents\n- Cauchemars et rêves d\'angoisse',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Rêves Créatifs',
        description: '- Utilisation des rêvs pour la créativité artistique\n- Rêves pour l\'écriture ou l\'art\n- Inspirations oniriques',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Amélioration du sommeil',
        description: '- Conseil pour un sommeil réparateur\n- Techniques de relaxation pour améliorer la qualité du sommeil\n- Rituel de coucher pour favoriser les rêves',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Rêves et Psychologie',
        description: '- Analyse psychologique des rêves\n- Rêves et subconscient\n- Thérapies basées sur les rêves',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('categories');
  }
};
