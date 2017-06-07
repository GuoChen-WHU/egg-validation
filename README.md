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

```js
// {app_root}/app/controller/post.js
class postController extends app.Controller {
  *index(ctx) {
    ctx.validate({
      title: {
        type: 'length',
        min: 10,
        max: 50 
      },
      page: {
        type: 'int',
        required: false,
        gl: 0
      },
      tag: {
        type: 'in',
        values: ['react', 'vue', 'angular']
      }
    });
  }
}
```

Fields are required by default, for field not requried, add `required: false`.

### Via abbreviated rule

The plugin provide a more concise format for rules. This is recommended when there is no extra option. 

```js
// {app_root}/app/controller/post.js
class postController extends app.Controller {
  *index(ctx) {
    ctx.validate({
      post_id: 'mongoId',
      page: 'int',
      title: 'alphanumeric'
    });
  }
}
```

Fields are required in this format, for field not required, use object rule instead.

The validate function accepts second argument: the data need to be validated, which defaults to ctx.request.body.

```js
ctx.validate({
  post_id: 'mongoId',
  page: 'int',
  title: 'alphanumeric'
}, {
  ...ctx.request.body, 
  ...ctx.params
});
``` 

## Rules

Here are some frequently used rules, see [validator](https://github.com/chriso/validator.js) for all rules supported.

* contains: check if the field contains the seed.
```
{
  type: 'contains',
  seed: 'xxx'
}
```
* equals
```
{
  type: 'equals',
  // check if equals to another field
  field: 'password'
  // or if equals to certain literal string
  literal: 'pass123'
}
```
* after: check if the field is a date that's after the specified date
```
{
  type: 'after',
  date: new Date(2017, 5, 7)
}
```
* alpha: check if the field contains only letters (a-zA-Z).
* alphanumeric: check if the field contains only letters and numbers.
* boolean
* decimal: check if the field represents a decimal number, such as 0.1, .3, 1.1, 1.00003, 4.0, etc.
* email
* empty: check if the field has a length of zero.
* float
```
{
  type: 'float',
  min: 7.22,
  max: 9.55,
  // or
  gl: 7.22, // greater than
  lt: 9.55 // less than
}
```
* in: check if the field is in a array of allowed values.
```
{
  type: 'in',
  values: ['react', 'vue', 'angular']
}
```
* int: support min, max, gl, lt option as float, and allow_leading_zeroes option.
* JSON: check if the field is valid JSON (note: uses JSON.parse).
* length: check if the field's length falls in a range
```
{
  type: length,
  min: 5,
  max: 50
}
```
* mobilePhone
* mongoId
* numeric
* url: check if the field is an URL. 
* matches: check if field matches the pattern.
```
{
  type: 'matches',
  pattern: /foo/i
}
```

## License

[MIT](LICENSE)
