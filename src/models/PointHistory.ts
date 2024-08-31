import { DataTypes, Model, Optional, Sequelize } from 'sequelize'
import { sequelize } from '../sequelize'

/**
 * Represents the attributes of a PointHistory.
 */
interface PointHistoryAttributes {
  id?: number
  userId: number
  points: number
  description: string
  fromSystem: boolean
  fromUserId?: number
  type: 'add' | 'set' | 'remove'
  createdAt?: Date
  updatedAt?: Date
}

type PointHistoryCreationAttributes = Optional<PointHistoryAttributes, 'id' | 'fromUserId'>

/**
 * The PointHistory class represents a PointHistory entity in the application.
 * It extends the Model class and implements the PointHistoryAttributes interface.
 *
 * @class PointHistory
 * @extends Model<PointHistoryAttributes>
 * @implements PointHistoryAttributes
 */
class PointHistory extends Model<
  PointHistoryAttributes,
  PointHistoryCreationAttributes
> implements PointHistoryAttributes {
  public id!: number

  public userId!: number

  public points!: number

  public description!: string

  public fromSystem!: boolean

  public fromUserId!: number

  public type!: 'add' | 'set' | 'remove'

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
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        points: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        fromSystem: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        fromUserId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
        },
        type: {
          type: DataTypes.ENUM('add', 'set', 'remove'),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'pointsHistory',
        modelName: 'PointHistory',
      },
    )
  }
}

PointHistory.initialize(sequelize)

export { PointHistory }
