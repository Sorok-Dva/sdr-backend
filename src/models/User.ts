import { DataTypes, Model, Optional, Sequelize } from 'sequelize'
import { UserDream } from 'src/models/UserDream'
import { sequelize } from '../sequelize'

interface UserAttributes {
  id?: number
  email: string
  nickname: string
  avatar?: string
  password: string
  roleId: number
  points: number
  validated: boolean
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

/**
 * Represents the attributes needed for creating a new user.
 *
 * @interface UserCreationAttributes
 * @extends {Optional<UserAttributes, 'id'>}
 */
type UserCreationAttributes = Optional<UserAttributes, 'id' | 'points'>

/**
 * Represents a User.
 * @class User
 * @extends Model<UserAttributes>
 * @implements UserAttributes
 */
class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number

  public email!: string

  public nickname!: string

  public avatar!: string

  public password!: string

  public roleId!: number

  public points!: number

  public validated!: boolean

  public readonly createdAt!: Date

  public readonly updatedAt!: Date

  public readonly deletedAt!: Date | null

  public readonly dreams?: UserDream[]

  static initialize (sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        nickname: {
          type: DataTypes.STRING(15),
          allowNull: false,
          unique: true,
        },
        avatar: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: false,
          defaultValue: '/img/defaultAvatar.png',
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        roleId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Roles',
            key: 'id',
          },
        },
        points: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        validated: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: 'users',
        modelName: 'User',
      },
    )
  }
}

User.initialize(sequelize)

export { User }
