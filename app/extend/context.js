'use strict';

const pick = require('lodash.pick');

const noop = function() {};

/**
 * Extract validator second argument from object rule.
 */
const extract = {
  contains(rule) {
    return rule.seed;
  },
  equals: noop, // equals need process seperately
  after(rule) {
    return rule.date;
  },
  alpha(rule) {
    return rule.local;
  },
  alphanumeric(rule) {
    return rule.local;
  },
  ascii: noop,
  base64: noop,
  before(rule) {
    return rule.date;
  },
  boolean: noop,
  byteLength(rule) {
    return pick(rule, [ 'min', 'max' ]);
  },
  creditCard: noop,
  currency: noop,
  dataURI: noop,
  decimal: noop,
  divisibleBy(rule) {
    return rule.number;
  },
  email(rule) {
    return pick(rule, [ 'allow_display_name', 'require_display_name', 'allow_utf8_local_part', 'require_tld' ]);
  },
  empty: noop,
  FQDN(rule) {
    return pick(rule, [ 'require_tld', 'allow_underscores', 'allow_trailing_dot' ]);
  },
  float(rule) {
    return pick(rule, [ 'min', 'max', 'gt', 'lt' ]);
  },
  fullWidth: noop,
  halfWidth: noop,
  hexColor: noop,
  hexadecimal: noop,
  IP(rule) {
    return rule.version;
  },
  ISBN(rule) {
    return rule.version;
  },
  ISSN(rule) {
    return pick(rule, [ 'case_sensitive', 'require_hyphen' ]);
  },
  ISIN: noop,
  ISO8601: noop,
  in(rule) {
    return rule.values;
  },
  int(rule) {
    return pick(rule, [ 'min', 'max', 'allow_leading_zeroes', 'gt', 'lt' ]);
  },
  JSON: noop,
  length(rule) {
    return pick(rule, [ 'min', 'max' ]);
  },
  lowercase: noop,
  MACAddress: noop,
  MD5: noop,
  mobilePhone(rule) {
    return rule.local;
  },
  mongoId: noop,
  multibyte: noop,
  numeric: noop,
  surrogatePair: noop,
  URL(rule) {
    return pick(rule, [
      'protocols',
      'require_tld',
      'require_protocol',
      'require_host',
      'require_valid_protocol',
      'allow_underscores',
      'host_whitelist',
      'host_blacklist',
      'allow_trailing_dot',
      'allow_protocol_relative_urls',
    ]);
  },
  UUID(rule) {
    return rule.version;
  },
  uppercase: noop,
  variableWidth: noop,
  whitelisted(rule) {
    return rule.chars;
  },
  matches(rule) {
    return rule.pattern;
  },
};

module.exports = {
  validate(rules, data) {
    if (typeof rules !== 'object') {
      this.throw(500, 'rules must be an object');
    }

    const errors = [];
    data = data || this.request.body;

    for (const field in rules) {
      if (rules.hasOwnProperty(field)) {
        let rule = rules[field];
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
          // field is required in abbreviated rule
          if (!data.hasOwnProperty(field)) {
            errors.push({
              code: 'missing_field',
              field,
              message: 'required',
            });
            continue;
          }
          const value = data[field];
          rule = 'is' + rule.replace(/^\w/, s => s.toUpperCase());
          if (!this.app.validator.hasOwnProperty(rule)) {
            this.throw(500, `rule ${rule} is not supportted`);
          }
          pass = this.app.validator[rule](value);

        /**
         * object rule, can take extra arguments
         *
         * e.g.
         * {
         *   page: {
         *     type: 'int',
         *     min: 1,
         *     max: 50
         *   },
         *   time: {
         *     type: 'after',
         *     required: false,
         *     date: new Date(2017, 5, 7)
         *   }
         * }
         */
        } else if (typeof rule === 'object') {

          // field is required by default
          if (typeof rule.required === 'undefined') rule.required = true;

          if (!data.hasOwnProperty(field)) {
            if (rule.required) {
              errors.push({
                code: 'missing_field',
                field,
                message: 'required',
              });
            }
            continue;
          }
          const value = data[field];

          const type = rule.type;
          if (!extract.hasOwnProperty(type)) {
            this.throw(500, `type ${type} is not supportted`);
          }

          if (type === 'equals') {
            let comparison;
            if (rule.field) {
              comparison = data[rule.field];
            } else {
              comparison = rule.literal;
            }
            pass = this.app.validator.equals(value, comparison);
          } else if (type === 'contains') {
            pass = this.app.validator.contains(value, extract[type](rule));
          } else if (type === 'matches') {
            pass = this.app.validator.matches(value, extract[type](rule));
          } else {
            pass = this.app.validator['is' + type.replace(/^\w/, s => s.toUpperCase())](value, extract[type](rule));
          }

          rule = type; // for message
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
