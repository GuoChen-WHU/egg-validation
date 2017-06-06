'use strict';

module.exports = app => {

  const rules = {
    email: 'email',
    page: {
      expect: 'isInt',
      args: [
        {
          min: 1,
          max: 20,
        },
      ],
    },
    id: 'mongoId',
  };

  class testController extends app.Controller {
    * index(ctx) {
      ctx.validate(rules);
      ctx.body = ctx.request.body;
      ctx.status = 200;
    }
  }

  return testController;
};
