import { DataTypes, Model, Optional, Sequelize } from 'sequelize'
import { sequelize } from '../sequelize'

/**
 * Represents the attributes of a role.
 *
 * @interface LevelAttributes
 */
interface LevelAttributes {
  id: number
  level: number
  pointsRequired: number
  title: string
}

/**
 * Represents the attributes required to create a role.
 * @interface
 * @extends Optional<Level, "id">
 */
type LevelCreationAttributes = Optional<LevelAttributes, 'id'>

/**
 * Represents a transaction in the system.
 *
 * @class
 * @extends Model
 * @implements LevelAttributes
 */
class Level extends Model<LevelAttributes> implements LevelAttributes {
  public id!: number

  public level!: number

  public title!: string

  public pointsRequired!: number

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
        level: {
          type: DataTypes.INTEGER,
          unique: true,
        },
        pointsRequired: {
          type: DataTypes.INTEGER,
        },
        title: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
        tableName: 'levels',
        modelName: 'Level',
      },
    )
  }
}

Level.initialize(sequelize)

export { Level }
