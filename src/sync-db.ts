import { sequelize } from './sequelize'

import './models/index'

const syncDatabase: () => Promise<void> = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')

    await sequelize.sync({ force: true })
    console.log('Database synchronized.')

    process.exit(0)
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    process.exit(1)
  }
}

syncDatabase()
