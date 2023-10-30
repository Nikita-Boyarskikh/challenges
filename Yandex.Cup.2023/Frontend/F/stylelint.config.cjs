module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order',
    'stylelint-prettier/recommended',
  ],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        'ignore-at-rules': ['mixin', 'mixin-content', 'define-mixin'],
      },
    ],
    'selector-max-id': 0,
  },
};
