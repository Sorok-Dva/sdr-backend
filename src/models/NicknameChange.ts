import { DataTypes, Model, Optional, Sequelize } from 'sequelize'
import { sequelize } from '../sequelize'

/**
 * Represents the attributes of a NicknameChanges.
 */
interface NicknameChangeAttributes {
  id?: number
  userId: number
  oldNickname: string
  newNickname: string
  createdAt?: Date
  updatedAt?: Date
}

type NicknameChangeCreationAttributes = Optional<NicknameChangeAttributes, 'id'>

/**
 * The NicknameChanges class represents a NicknameChanges entity in the application.
 * It extends the Model class and implements the NicknameChangeAttributes interface.
 *
 * @class NicknameChange
 * @extends Model<NicknameChangeAttributes>
 * @implements NicknameChangeAttributes
 */
class NicknameChange extends Model<
  NicknameChangeAttributes,
  NicknameChangeCreationAttributes
> implements NicknameChangeAttributes {
  public id!: number

  public userId!: number

  public oldNickname!: string

  public newNickname!: string

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
        oldNickname: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        newNickname: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'nicknameChanges',
        modelName: 'NicknameChange',
      },
    )
  }
}

NicknameChange.initialize(sequelize)

export { NicknameChange }
