import { DataTypes, Model, Optional, Sequelize } from 'sequelize'
import { sequelize } from '../sequelize'

/**
 * Represents the attributes of an event.
 */
interface EventAttributes {
  id?: number
  type: 'Upload' | 'EditPrivacy' | 'Delete'
  userId: number
  screenshotId: number
  description: string
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Represents the attributes required for creating an event.
 *
 * @interface
 * @extends {EventAttributes}
 * @template T - The type of the "id" property
 */
type EventCreationAttributes = Optional<EventAttributes, 'id'>

/**
 * The Event class represents an event entity in the application.
 * It extends the Model class and implements the EventAttributes interface.
 *
 * @class Event
 * @extends Model<EventAttributes>
 * @implements EventAttributes
 */
class Event extends Model<EventAttributes> implements EventAttributes {
  public id!: number

  public type!: 'Upload' | 'EditPrivacy' | 'Delete'

  public userId!: number

  public screenshotId!: number

  public description!: string

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
        type: {
          type: DataTypes.ENUM('Upload', 'EditPrivacy', 'Delete'),
          allowNull: false,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        screenshotId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'events',
        modelName: 'Event',
      },
    )
  }
}

Event.initialize(sequelize)

export { Event }
