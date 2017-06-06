'use strict';

const validator = require('validator');

module.exports = app => {
  app.validator = validator;
};
