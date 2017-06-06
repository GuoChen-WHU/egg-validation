'use strict';

module.exports = {
  validate(rules, data) {
    if (typeof rules !== 'object') {
      this.throw(500, 'Need object type rule');
    }

    const errors = [];
    data = data || this.request.body;

    for (const field in rules) {
      if (rules.hasOwnProperty(field)) {
        let rule = rules[field];

        if (!data.hasOwnProperty(field)) {
          errors.push({
            code: 'missing_field',
            field,
            message: 'required',
          });
          continue;
        }

        const value = data[field];
        let pass = false;

        /**
         * abbreviated rule
         *
         * e.g.
         * {
         *   id: 'mongoId',
         *   page: 'int'
         * }
         */
        if (typeof rule === 'string') {
          rule = 'is' + rule.replace(/^\w/, s => s.toUpperCase());
          pass = this.app.validator[rule](value);

        /**
         * object rule, can take extra arguments
         *
         * e.g.
         * {
         *   page: {
         *     expect: 'isInt',
         *     args: [
         *       {
         *         min: 1,
         *         max: 50
         *       }
         *     ]
         *   },
         *   time: {
         *     expect: 'isAfter',
         *     args: [
         *       new Date(2017, 5, 5)
         *     ]
         *   }
         * }
         */
        } else if (typeof rule === 'object') {
          const args = rule.args;
          args.unshift(value);
          rule = rule.expect;
          pass = this.app.validator[rule].apply(null, args);
        }

        if (!pass) {
          errors.push({
            code: 'invalid',
            field,
            message: `violate ${rule}`,
          });
        }
      }
    }
    if (errors.length) {
      this.throw(422, 'Validate Failed', {
        code: 'invalid_param',
        errors,
      });
    }
  },
};