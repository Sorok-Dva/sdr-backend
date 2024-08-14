import { DataTypes, Model, Optional, Sequelize } from 'sequelize'
import { User } from 'src/models/User'
import { sequelize } from '../sequelize'

interface TutorialAttributes {
  id: number
  userId: number
  categoryId: number
  title: string
  content: string
  views: number
  validated: boolean
  validatedByUserId: number
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

type TutorialCreationAttributes = Optional<TutorialAttributes, 'id' | 'views' | 'validated' | 'validatedByUserId'>;

class Tutorial extends Model<TutorialAttributes, TutorialCreationAttributes> implements TutorialAttributes {
  public id!: number

  public userId!: number

  public categoryId!: number

  public title!: string

  public content!: string

  public views!: number

  public validated!: boolean

  public validatedByUserId!: number

  public readonly createdAt!: Date

  public readonly updatedAt!: Date

  public readonly deletedAt!: Date

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
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        views: {
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
