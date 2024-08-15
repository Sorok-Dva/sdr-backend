import { DataTypes, Model, Optional, Sequelize } from 'sequelize'
import { sequelize } from '../sequelize'

interface CommentAttributes {
  id: number
  userId: number
  tutorialId: number
  content: string
  upvote: number
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

type CommentCreationAttributes = Optional<
  CommentAttributes,
  'id' | 'upvote'
>;

class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
  public id!: number

  public userId!: number

  public tutorialId!: number

  public content!: string

  public upvote!: number

  public readonly createdAt!: Date

  public readonly updatedAt!: Date

  public deletedAt!: Date | null

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
          allowNull: false,
          references: {
            model: 'tutorials',
            key: 'id',
          },
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        upvote: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'comments',
        modelName: 'Comment',
      },
    )
  }
}

Comment.initialize(sequelize)

export { Comment }
