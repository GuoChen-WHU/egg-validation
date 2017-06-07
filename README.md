# egg-validation

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-validation.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-validation
[download-image]: https://img.shields.io/npm/dm/egg-validation.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-validation

A validate plugin for egg based on [validator](https://github.com/chriso/validator.js). Best suited for request parameter validation.

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

### Via object rule

Currently, the plugin simply map the `expect` field to a validator function, and the `args` field is passed as arguments to that function.
See [validator](https://github.com/chriso/validator.js) for all validators and how to define `args` properly.

All fields is required by default, for field not requried, add `required: false` as in the `page` field.

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
        required: false,
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

All fields are required in this format, for field not required, use object rule instead. e.g. `{ page: { expect: 'isInt', required: false } }`.

## License

[MIT](LICENSE)
