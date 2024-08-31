import { DataTypes, Model, Optional, Sequelize } from 'sequelize'
import { UserDream } from './UserDream'
import { PointHistory } from './PointHistory'
import { sequelize } from '../sequelize'

interface UserAttributes {
  id?: number
  email: string
  oldEmail: string
  nickname: string
  avatar?: string
  password: string
  roleId: number
  points: number
  level: number
  title: string
  validated: boolean
  resetPasswordToken?: string | null
  resetPasswordExpires?: Date | null
  lastNicknameChange?: Date | null
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
type UserCreationAttributes = Optional<
  UserAttributes,
  'id' | 'oldEmail' | 'points' | 'lastNicknameChange' | 'level' | 'title'
>

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

  public oldEmail!: string

  public nickname!: string

  public avatar!: string

  public password!: string

  public roleId!: number

  public points!: number

  public level!: number

  public title!: string

  public validated!: boolean

  public resetPasswordToken!: string | null

  public resetPasswordExpires!: Date | null

  public lastNicknameChange!: Date | null

  public readonly createdAt!: Date

  public readonly updatedAt!: Date

  public deletedAt!: Date | null

  public readonly dreams?: UserDream[]

  public readonly pointsHistory?: PointHistory[]

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
        oldEmail: {
          type: DataTypes.STRING,
          allowNull: true,
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
        level: {
          type: DataTypes.INTEGER,
          defaultValue: 1,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING,
          defaultValue: 'Rêveur',
          allowNull: true,
        },
        resetPasswordToken: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        resetPasswordExpires: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        lastNicknameChange: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        validated: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
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
