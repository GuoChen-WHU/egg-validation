'use strict';

module.exports = app => {

  const rules = {
    email: 'email',
    page: {
      type: 'int',
      required: false,
      min: 1,
      max: 20
    },
    id: 'mongoId',
    tag: {
      type: 'in',
      required: false,
      values: ['react', 'angular', 'vue']
    },
    password: 'alphanumeric',
    ['re-password']: {
      type: 'equals',
      field: 'password'
    }
  };

  class testController extends app.Controller {
    * index(ctx) {
      ctx.validate(rules);
      ctx.status = 200;
    }
  }

  return testController;
};
