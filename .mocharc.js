module.exports = {
  "extensions": ["ts"],
  require: [
    'ts-node/register/transpile-only',
    'tsconfig-paths/register',
  ],
  file: [
    './test/mocha.env.ts',
    './test/mocha.setup.ts',
    './test/mocha.teardown.ts',
  ],
  "node-option": [
    "experimental-specifier-resolution=node",
    "loader=ts-node/esm"
  ],
  timeout: 10000,
  recursive: true,
  colors: true,
  exit: true,
}
