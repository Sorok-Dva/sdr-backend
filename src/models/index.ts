import { User } from './User'
import { Event } from './Event'
import { Comment } from './Comment'
import { sequelize } from '../sequelize'
import { Report } from './Report'
import { Role } from './Role'
import { Tutorial } from './Tutorial'
import { UserDream } from './UserDream'
import { CommentUpvote } from './CommentUpvote'

// Associations

// User and Role
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' })
Role.hasMany(User, { foreignKey: 'roleId', as: 'users' })

// User and UserDream
User.hasMany(UserDream, { foreignKey: 'userId', as: 'userDreams' })
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

// Tutorial and Comment
Tutorial.hasMany(Comment, { foreignKey: 'tutorialId', as: 'comments' })
Comment.belongsTo(Tutorial, { foreignKey: 'tutorialId', as: 'tutorial' })

// Comment and CommentUpvote
Comment.hasMany(CommentUpvote, { foreignKey: 'commentId', as: 'upvotes' })
CommentUpvote.belongsTo(Comment, { foreignKey: 'commentId', as: 'comment' })

// User and CommentUpvote
User.hasMany(CommentUpvote, { foreignKey: 'userId', as: 'commentUpvotes' })
CommentUpvote.belongsTo(User, { foreignKey: 'userId', as: 'user' })

export {
  Role,
  User,
  Event,
  UserDream,
  Report,
  Tutorial,
  Comment,
  CommentUpvote,
  sequelize,
}
