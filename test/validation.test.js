'use strict';

const request = require('supertest');
const mm = require('egg-mock');

describe('test/validation.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'apps/validation-test',
    });
    return app.ready();
  });

  after(() => app.close());

  it('should return 422 when body empty', () => {
    return request(app.callback())
      .post('/')
      .type('json')
      .expect(422);
  });

  it('should return 422 when field not valid', () => {
    return request(app.callback())
      .post('/')
      .send({
        email: '123',
        page: '5',
        id: '59340fd751d47615b8d2917a',
      })
      .expect(422);
  });

  it('should all pass', () => {
    return request(app.callback())
      .post('/')
      .send({
        email: 'foo@gmail.com',
        page: '5',
        id: '59340fd751d47615b8d2917a',
      })
      .expect({
        email: 'foo@gmail.com',
        page: '5',
        id: '59340fd751d47615b8d2917a',
      })
      .expect(200);
  });
});
