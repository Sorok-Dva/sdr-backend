import { DataTypes, Model, Optional, Sequelize } from 'sequelize'
import { sequelize } from '../sequelize'

interface CommentUpvoteAttributes {
  id: number
  userId: number
  commentId: number
  createdAt?: Date
  updatedAt?: Date
}

type CommentUpvoteCreationAttributes = Optional<CommentUpvoteAttributes, 'id'>

class CommentUpvote extends Model<CommentUpvoteAttributes, CommentUpvoteCreationAttributes> implements CommentUpvoteAttributes {
  public id!: number

  public userId!: number

  public commentId!: number

  public readonly createdAt!: Date

  public readonly updatedAt!: Date

  static initialize (sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        commentId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'comments',
            key: 'id',
          },
        },
      },
      {
        sequelize,
        tableName: 'commentUpvotes',
        modelName: 'CommentUpvote',
      },
    )
  }
}

CommentUpvote.initialize(sequelize)

export { CommentUpvote }
