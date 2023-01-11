'use strict';

module.exports = {
  async up (queryInterface) {
    return Promise.all([
      queryInterface.bulkInsert('user', [
        {
          first_name: 'Admin', last_name:'admin', email: 'jyoti.kumari@softradix.in', phone_number: '8872113845', password: '123456', status: 1, createdAt: new Date(), updatedAt: new Date(),
        }
      ], { truncate: true }),
    ]);
  },
    down: (queryInterface) => queryInterface.bulkDelete('user', null, { truncate: true }),
};
