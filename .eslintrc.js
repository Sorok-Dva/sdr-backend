module.exports = {
  "parser": "@typescript-eslint/parser",
  extends: [
    'materya',
    'materya/typescript',
  ],

  overrides: [
    /* Global overrides */
    {
      files: ['*.ts'],
      parserOptions: {
        project: ['./tsconfig.eslint.json'],
      },
    },

    /* Test overrides */
    {
      env: {
        mocha: true,
      },
      extends: [
        'plugin:mocha/recommended',
      ],
      files: [
        '**/*.test.ts',
        'test/**/*',
      ],
      plugins: ['mocha'],
      rules: {
        '@typescript-eslint/no-explicit-any': ['off'],
        'func-names': ['off'],
        'import/no-extraneous-dependencies': ['error', {
          devDependencies: [
            '**/*.test.ts',
            'test/**/*',
          ],
        }],
        'mocha/no-mocha-arrows': ['off'],
        'mocha/no-setup-in-describe': ['off'],
        'prefer-arrow-callback': ['off'],
      },
    },
  ],

  rules: {
    /**
     * Naming Convention
     */
    '@typescript-eslint/naming-convention': ['error',
      {
        format: ['strictCamelCase'],
        leadingUnderscore: 'forbid',
        selector: 'default',
        trailingUnderscore: 'forbid',
      },

      /**
       * Match no-unused-vars config on explicit unused vars with a leading `_`
       */
      {
        format: ['strictCamelCase'],
        leadingUnderscore: 'allow',
        modifiers: ['unused'],
        selector: ['variable', 'parameter'],
        trailingUnderscore: 'forbid',
      },

      /**
       * Allow `PascalCase` for specific library payload Keys
       * - aws
       * - PdfMake
       */

      {
        filter: {
          match: true,
          regex: '^(AccessKeyId|Authorization|Body|Bucket|Caveat|ContentDisposition|ContentType|CopySource|Credentials|Expires|Key|Roboto|RoleArn|RoleSessionName|SecretAccessKey|SessionToken)$',
        },
        format: ['PascalCase'],
        leadingUnderscore: 'forbid',
        selector: ['objectLiteralProperty'],
        trailingUnderscore: 'forbid',
      },

      /**
       * Allow `snake_case` for db payload & db types
       */
      {
        format: ['strictCamelCase', 'snake_case'],
        leadingUnderscore: 'forbid',
        selector: ['objectLiteralProperty', 'typeProperty'],
        trailingUnderscore: 'forbid',
      },

      /**
       * Special members convention as PascalCase
       */
      {
        format: ['StrictPascalCase'],
        selector: ['enumMember', 'typeLike'],
      },

      /**
       * Get loose on destructuring since we get payload of a lot of
       * different format.
       */
      {
        format: [
          'strictCamelCase',
          'snake_case',
          'StrictPascalCase',
          'UPPER_CASE',
        ],
        modifiers: ['destructured'],
        selector: 'variable',
      },
    ],

    'import/no-extraneous-dependencies': ['error', {
      devDependencies: ['db/**/*'],
    }],
    'import/no-unresolved': ['error', {
      ignore: [
        '^@/*', // tsconfig local paths mapping
      ],
    }],

    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 5 }],

    'no-unused-vars': ['warn', {
      'vars': 'all',
      'args': 'none',
    }],
  },
}
