import { DataTypes, Model, Optional, Sequelize } from 'sequelize'
import { sequelize } from '../sequelize'

export type ReportReason =
  | 'inappropriate_content'
  | 'copyright_violation'
  | 'privacy_violation'
  | 'hate_speech'
  | 'spam'
  | 'other'
;interface ReportAttributes {
  id?: number
  userDreamId: number
  userId: number
  adminId: number
  reason: ReportReason
  solvedReason?: ReportReason
  status: 'Pending' | 'Resolved'
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

/**
 * Represents the attributes required for creating a report.
 *
 * @interface
 * @extends {ReportAttributes}
 * @template T - The type of the "id" property
 */
export type ReportCreationAttributes = Optional<
  ReportAttributes,
  'id' | 'status' | 'solvedReason' | 'adminId'
>

/**
 * The Report class represents an event entity in the application.
 * It extends the Model class and implements the ReportAttributes interface.
 *
 * @class Report
 * @extends Model<ReportAttributes>
 * @implements ReportAttributes
 */
class Report extends Model<ReportAttributes, ReportCreationAttributes> implements ReportAttributes {
  public id!: number

  public reason!: ReportReason

  public solvedReason!: ReportReason

  public userDreamId!: number

  public userId!: number

  public adminId!: number

  public status!: 'Pending' | 'Resolved'

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
        userDreamId: {
          type: DataTypes.UUID,
          allowNull: false,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        reason: {
          type: DataTypes.ENUM('inappropriate_content', 'copyright_violation', 'privacy_violation', 'hate_speech', 'spam', 'other'),
          allowNull: false,
        },
        solvedReason: {
          type: DataTypes.ENUM('inappropriate_content', 'copyright_violation', 'privacy_violation', 'hate_speech', 'spam', 'other'),
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM('Pending', 'Resolved'),
          allowNull: false,
          defaultValue: 'Pending',
        },
        adminId: {
          type: DataTypes.UUID,
          allowNull: true,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'Report',
        tableName: 'reports',
        timestamps: true,
      },
    )
  }
}

Report.initialize(sequelize)

export { Report }
