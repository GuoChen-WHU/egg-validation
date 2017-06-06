'use strict';

module.exports = app => {
  app.get('/', 'test.index');
  app.post('/', 'test.index');
};
