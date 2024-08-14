import { User } from './User'
import { Event } from './Event'
import { sequelize } from '../sequelize'
import { Report } from './Report'
import { Role } from './Role'
import { Tutorial } from './Tutorial'
import { UserDream } from './UserDream'

// Associations
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' })
Role.hasMany(User, { foreignKey: 'roleId', as: 'user' })

User.hasMany(UserDream, { foreignKey: 'userId', as: 'userDreams' })
User.hasMany(Report, { foreignKey: 'userId', as: 'reports' })

UserDream.belongsTo(User, { foreignKey: 'userId', as: 'user' })
UserDream.hasMany(Report, { foreignKey: 'userDreamId', as: 'reports' })

Report.belongsTo(User, { foreignKey: 'userId', as: 'user' })
Report.belongsTo(UserDream, { foreignKey: 'userDreamId', as: 'userDream' })

Event.belongsTo(User, { foreignKey: 'userId', as: 'user' })

export {
  Role,
  User,
  Event,
  UserDream,
  Report,
  Tutorial,
  sequelize,
}
