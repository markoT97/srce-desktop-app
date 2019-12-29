'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Volunteers', [{
        volunteer_id: 1,
        first_name: 'Marko',
        last_name: 'Tričković',
        created_at: new Date()
      }, 
      {
        volunteer_id: 2,
        first_name: 'Jovan',
        last_name: 'Jovanović',
        created_at: new Date()
      }, 
      {
        volunteer_id: 3,
        first_name: 'Stefan',
        last_name: 'Dušan',
        created_at: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Volunteers', null, {});
  }
};
