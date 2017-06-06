# egg-validation

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-validation.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-validation
[travis-image]: https://img.shields.io/travis/eggjs/egg-validation.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-validation
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-validation.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-validation?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-validation.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-validation
[snyk-image]: https://snyk.io/test/npm/egg-validation/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-validation
[download-image]: https://img.shields.io/npm/dm/egg-validation.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-validation

A validate plugin for egg based on validator. Best suited for request parameter validation.

## Install

```bash
$ npm i egg-validation --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.validation = {
  enable: true,
  package: 'egg-validation',
};
```

### Via option object

Currently, the plugin simply map the `expect` field to a validator function, and the `args` field is passed as arguments to that function.
See [validator](https://github.com/chriso/validator.js) for all validators and how to define `args` properly.

```js
// {app_root}/app/controller/post.js
class postController extends app.Controller {
  *index(ctx) {
    ctx.validate({
      title: {
        expect: 'isLength',
        args: [
          {
            min: 10,
            max: 50 
          }
        ]
      },
      page: {
        expect: 'isInt',
        args: [
          {
            min: 1,
            max: 20
          }
        ]
      },
      tag: {
        expect: 'isIn',
        args: [
          'react', 'vue', 'angular'
        ]
      }
    });
  }
}
```

### Via abbreviated rule

The plugin provide a more concise format for rules. This is recommended when there is no extra option, all [validators](https://github.com/chriso/validator.js) begins with `is` are supportted. 

```js
// {app_root}/app/controller/post.js
class postController extends app.Controller {
  *index(ctx) {
    ctx.validate({
      post_id: 'mongoId',
      page: 'int',
      tag: 'alpha'
    });
  }
}
```

## License

[MIT](LICENSE)
