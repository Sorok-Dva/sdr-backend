import { DataTypes, Model, Optional, Sequelize } from 'sequelize'
import { sequelize } from '../sequelize'

interface CommentUpvoteAttributes {
  id: number
  userId: number
  commentId?: number
  tutorialId?: number
  createdAt?: Date
  updatedAt?: Date
}

type CommentUpvoteCreationAttributes = Optional<
  CommentUpvoteAttributes,
  'id' | 'commentId' | 'tutorialId'
>

class Upvote extends Model<CommentUpvoteAttributes, CommentUpvoteCreationAttributes> implements CommentUpvoteAttributes {
  public id!: number

  public userId!: number

  public commentId!: number

  public tutorialId!: number

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
        tutorialId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'tutorials',
            key: 'id',
          },
        },
        commentId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'comments',
            key: 'id',
          },
        },
      },
      {
        sequelize,
        tableName: 'upvotes',
        modelName: 'Upvote',
        validate: {
          eitherCommentOrTutorial () {
            if (!this.commentId && !this.tutorialId) {
              throw new Error('Either commentId or tutorialId must be provided.')
            }
          },
        },
      },
    )
  }
}

Upvote.initialize(sequelize)

export { Upvote }
