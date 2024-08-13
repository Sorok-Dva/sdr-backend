import { DataTypes, Model, Optional, Sequelize } from 'sequelize'
import { sequelize } from '../sequelize'

/**
 * Represents the attributes of a role.
 *
 * @interface RoleAttributes
 */
interface RoleAttributes {
  id: number
  name: string
}

/**
 * Represents the attributes required to create a role.
 * @interface
 * @extends Optional<Role, "id">
 */
type RoleCreationAttributes = Optional<Role, 'id'>

/**
 * Represents a transaction in the system.
 *
 * @class
 * @extends Model
 * @implements RoleAttributes
 */
class Role extends Model<RoleAttributes> implements RoleAttributes {
  public id!: number

  public name!: string

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
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        tableName: 'roles',
        modelName: 'Role',
      },
    )
  }
}

Role.initialize(sequelize)

export { Role }
