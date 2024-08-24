require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'sdr_local',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql'
  },
  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'sdr_test',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql'
  },
  production: {
    username: process.env.DB_USER || 'username',
    password: process.env.DB_PASS || 'password',
    database: process.env.DB_NAME || 'sdr',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql'
  }
};
