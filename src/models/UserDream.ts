import { DataTypes, Model, Optional, Sequelize } from 'sequelize'
import { sequelize } from '../sequelize'

export type DreamPrivacy = 'public' | 'private'
export type DreamCategory = 'joy' | 'fear'
/**
 * Represents the attributes of a UserDreams.
 */
interface UserDreamAttributes {
  id?: number
  userId: number
  title: string
  description: string
  privacy: DreamPrivacy
  category: DreamCategory
  views: number
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

/**
 * Represents the attributes required for creating a UserDreams.
 *
 * @interface
 * @extends {UserDreamAttributes}
 * @template T - The type of the "id" property
 */
type UserDreamCreationAttributes = Optional<UserDreamAttributes, 'id' & 'path' & 'views'>

/**
 * The UserDreams class represents a UserDreams entity in the application.
 * It extends the Model class and implements the UserDreamAttributes interface.
 *
 * @class UserDream
 * @extends Model<UserDreamAttributes>
 * @implements UserDreamAttributes
 */
class UserDream extends Model<UserDreamAttributes> implements UserDreamAttributes {
  public id!: number

  public userId!: number

  public title!: string

  public description!: string

  public views!: number

  public privacy!: DreamPrivacy

  public category!: DreamCategory

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
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        views: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        privacy: {
          type: DataTypes.ENUM('public', 'private'),
          allowNull: false,
        },
        category: {
          type: DataTypes.ENUM('joy', 'fear'),
          allowNull: false,
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'screenshots',
        modelName: 'UserDreams',
      },
    )
  }
}

UserDream.initialize(sequelize)

export { UserDream }
