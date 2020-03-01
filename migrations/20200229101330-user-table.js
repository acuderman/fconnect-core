'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.STRING(36),
        allowNull: false,
        primaryKey: true,
      },
      google_email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      student_email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      activated: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      tracking_id: {
        type: Sequelize.STRING(36),
        allowNull: false,
      },
      expires_at: {
        type: Sequelize.DATE,
        defaultValue: null,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};