import { DataTypes, Model, Optional, Sequelize } from 'sequelize'
import { sequelize } from '../sequelize'

interface TutorialAttributes {
  id: number
  userId: number
  categoryId: number
  title: string
  image: string
  content: string
  views: number
  upvote: number
  validated: boolean
  validatedByUserId: number
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

type TutorialCreationAttributes = Optional<
  TutorialAttributes,
  'id' | 'image' | 'views' | 'upvote' | 'validated' | 'validatedByUserId'
>;

class Tutorial extends Model<TutorialAttributes, TutorialCreationAttributes> implements TutorialAttributes {
  public id!: number

  public userId!: number

  public categoryId!: number

  public title!: string

  public image!: string

  public content!: string

  public views!: number

  public upvote!: number

  public validated!: boolean

  public validatedByUserId!: number

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
        },
        categoryId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        image: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        views: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        upvote: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        validated: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        validatedByUserId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'tutorials',
        modelName: 'Tutorial',
      },
    )
  }
}

Tutorial.initialize(sequelize)

export { Tutorial }
