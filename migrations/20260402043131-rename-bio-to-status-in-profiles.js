'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('Profiles', 'bio', 'status')
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.renameColumn('Profiles', 'status', 'bio')
  }
};
