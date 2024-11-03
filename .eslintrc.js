const namingConvention = [
  'error', // eslint will mark it as error

  // Apply naming conventions as default
  {
    selector: 'default',
    format: ['camelCase'],
  },

  // Apply naming conventions to enum members
  {
    selector: 'enumMember',
    format: ['UPPER_CASE'],
  },

  // Apply naming conventions to type-like declarations (e.g., interfaces, types)
  {
    selector: 'typeLike',
    format: ['PascalCase'],
  },

  // Apply naming conventions to classes
  {
    selector: 'class',
    format: ['PascalCase'],
  },

  // Apply naming conventions to class-methods
  {
    selector: 'classMethod',
    format: ['camelCase'],
  },

  // Apply naming conventions to class-property's
  {
    selector: 'classProperty',
    format: ['camelCase'],
  },

  // Apply naming conventions to functions
  {
    selector: 'function',
    format: ['camelCase'],
  },
];


module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'unicorn'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/naming-convention': [
      ...namingConvention,
      // Apply naming conventions to variables
      {
        selector: 'variable',
        format: ['camelCase'],
        leadingUnderscore: 'forbid',
      },
      // Apply naming conventions to properties
      {
        selector: 'property',
        format: ['camelCase', 'snake_case'],
        leadingUnderscore: 'forbid',
      },
      {
        selector: 'property',
        format: null,
        filter: {
          regex: '^(_id|__v)$', // Allows the specific property name "_id" with an underscore
          match: true,
        },
      },
    ],
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          kebabCase: true,
        }
      },
    ],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
  overrides: [
    {
      files: ['./test/**/*'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['src/common/config/configuration.ts'],
      rules: {
        '@typescript-eslint/naming-convention': [
          ...namingConvention,
          // Apply naming conventions to variables
          {
            selector: 'variable',
            format: ['camelCase', 'UPPER_CASE'],
            leadingUnderscore: 'forbid',
          },
          {
            selector: 'property',
            format: ['UPPER_CASE', 'camelCase'],
            leadingUnderscore: 'forbid',
          },
        ],
      },
    },
    {
      files: ['*entity.ts'],
      rules: {
        '@typescript-eslint/naming-convention': [
          ...namingConvention,
          {
            selector: 'variable',
            format: ['PascalCase'],
          },
          // Apply naming conventions to properties
          {
            selector: 'property',
            format: ['camelCase', 'snake_case'],
            leadingUnderscore: 'forbid',
          },
          {
            selector: 'property',
            format: null,
            filter: {
              regex: '^(_id|__v)$', // Allows the specific property name "_id" with an underscore
              match: true,
            },
          },
        ],
      },
    },
  ],
};

