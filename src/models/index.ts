import { Upvote } from './Upvote'
import { User } from './User'
import { Event } from './Event'
import { Category } from './Category'
import { Comment } from './Comment'
import { sequelize } from '../sequelize'
import { Report } from './Report'
import { Role } from './Role'
import { Tutorial } from './Tutorial'
import { Level } from './Level'
import { UserDream } from './UserDream'
import { NicknameChange } from './NicknameChange'

// Associations

// User and Role
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' })
Role.hasMany(User, { foreignKey: 'roleId', as: 'users' })

// User and UserDream
User.hasMany(UserDream, { foreignKey: 'userId', as: 'dreams' })
UserDream.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// User and Report
User.hasMany(Report, { foreignKey: 'userId', as: 'reports' })
Report.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// UserDream and Report
UserDream.hasMany(Report, { foreignKey: 'userDreamId', as: 'reports' })
Report.belongsTo(UserDream, { foreignKey: 'userDreamId', as: 'userDream' })

// Event and User
Event.belongsTo(User, { foreignKey: 'userId', as: 'user' })
User.hasMany(Event, { foreignKey: 'userId', as: 'events' })

// User and Comment
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' })
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// User and Tutorial
User.hasMany(Tutorial, { foreignKey: 'userId', as: 'tutorials' })
Tutorial.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// Tutorial and Comment
Tutorial.hasMany(Comment, { foreignKey: 'tutorialId', as: 'comments' })
Comment.belongsTo(Tutorial, { foreignKey: 'tutorialId', as: 'tutorial' })

// Tutorial and Upvote
Tutorial.hasMany(Upvote, { foreignKey: 'tutorialId', as: 'upvotes' })
Upvote.belongsTo(Tutorial, { foreignKey: 'tutorialId', as: 'tutorial' })

// Comment and Upvote
Comment.hasMany(Upvote, { foreignKey: 'commentId', as: 'upvotes' })
Upvote.belongsTo(Comment, { foreignKey: 'commentId', as: 'comment' })

// User and Upvote
User.hasMany(Upvote, { foreignKey: 'userId', as: 'commentUpvotes' })
Upvote.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// User and Nickname changes
User.hasMany(NicknameChange, { foreignKey: 'userId', as: 'nicknameChanges' })
NicknameChange.belongsTo(User, { foreignKey: 'userId', as: 'user' })

export {
  Role,
  User,
  Event,
  UserDream,
  Report,
  Tutorial,
  Category,
  Comment,
  Upvote,
  NicknameChange,
  Level,
  sequelize,
}
