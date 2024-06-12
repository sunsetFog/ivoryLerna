module.exports = {
  /**
   * npm i -D stylelint stylelint-config-standard
   * stylelint 文档 https://github.com/stylelint/stylelint
   * stylelint-config-standard 文档 https://github.com/stylelint/stylelint-config-standard
   */

  // stylelint-config-standard 默认规则 https://github.com/stylelint/stylelint-config-standard/blob/master/index.js
  extends: [
    'stylelint-config-standard',
    // https://github.com/bjankord/stylelint-config-sass-guidelines
    'stylelint-config-sass-guidelines',
    // https://github.com/stormwarning/stylelint-config-recess-order
    'stylelint-config-recess-order',
    // Lost grid config for stylelint. See https://github.com/delorge/stylelint-config-lost
    // 'stylelint-config-lost'
    'stylelint-config-prettier',
  ],
  plugins: [
    /**
     * This plugin checks if the CSS you're using is supported by the browsers
     * you're targeting. It uses doiuse to detect browser support. Doiuse itself
     * checks your code against the caniuse database and uses browserslist to get
     * the list of browsers you want to support. Doiuse and this plugin are only
     * compatible with standard css syntax, so syntaxes like scss, less and others
     * aren't supported.
     * 对css进行浏览器兼容性检查
     * see https://github.com/ismay/stylelint-no-unsupported-browser-features
     */
    'stylelint-no-unsupported-browser-features',
    'stylelint-prettier',
  ],
  rules: {
    // especially for scss. See https://github.com/kristerkari/stylelint-config-recommended-scss/blob/master/index.js

    'at-rule-no-unknown': null,
    'value-keyword-case': null,
    'scss/dollar-variable-pattern': [/^[a-z]+-/, { ignore: 'global' }],
    // rules specified from stylelint-no-unsupported-browser-features
    // see https://github.com/ismay/stylelint-no-unsupported-browser-features#recommendations
    'plugin/no-unsupported-browser-features': [
      true,
      {
        severity: 'warning',
        ignorePartialSupport: true,
      },
    ],
    'prettier/prettier': true,
    // add your overrides and additions here.
    // Suggested additions https://github.com/stylelint/stylelint-config-standard#suggested-additions
    'unit-no-unknown': [
      true,
      {
        ignoreFunctions: ['image-set'],
      },
    ],
    /**
     * Many rules have secondary options which provide further customization.
     * To set secondary options, a two-member array is used:
     * 将css module语法列进非标准pseudo白名单
     */
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],
    'selector-max-id': 2,
    // https://stylelint.io/user-guide/rules/no-descending-specificity
    'no-descending-specificity': null,
    // https://stylelint.io/user-guide/rules/selector-class-pattern
    'selector-class-pattern': null,
    // https://stylelint.io/user-guide/rules/color-named
    'color-named': null,
    // https://stylelint.io/user-guide/rules/max-nesting-depth
    'max-nesting-depth': null,
    // https://stylelint.io/user-guide/rules/selector-max-compound-selectors
    'selector-max-compound-selectors': null,
    // https://stylelint.io/user-guide/rules/declaration-property-value-disallowed-list
    'declaration-property-value-disallowed-list': null,
    /**
     * 注意：如果想使用order/properties-order规则，则需要禁用此项
     * https://github.com/hudochenkov/stylelint-order/blob/master/rules/properties-alphabetical-order/README.md
     */
    'order/properties-alphabetical-order': null,
    /**
     * Placeholder selectors are useful when writing a Sass library where each style rule may or may not be used.
     * As a rule of thumb, if you’re writing a stylesheet just for your own app, it’s often better to just extend
     * a class selector if one is available.
     * Placeholder selectors更适合用于sass library场景。由于声明的类样式可能会被使用或不被使用，
     * 如果使用Placeholder selectors在不被外部继承引用时，sass编译器则不会输出不被使用的样式代码。
     * 例如：
     * 如果自己的写的sass library包含如下class selector，即使外部没有引用关系，也会被编译输出到css中
     * .selector {}
     * 如果换成placeholder selector，编译器发现若没有引用关系则会忽略，不会输出到css中
     * %selector {}
     * https://sass-lang.com/documentation/style-rules/placeholder-selectors
     */
    'scss/at-extend-no-missing-placeholder': [true, { severity: 'warning' }],
  },
}
