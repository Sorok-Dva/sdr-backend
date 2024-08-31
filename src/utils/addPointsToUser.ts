import { Op } from 'sequelize'
import { notifyLevelUp } from '../routes/notifications'
import { User, Level, PointHistory } from '../models'

const addPointsToUser = async (
  userId: number,
  points: number,
  options: {
    fromSystem: boolean
    description: string
    fromUserId?: number
  },
  action: 'set' | 'add' = 'add',
): Promise<void> => {
  const user = await User.findByPk(userId)
  if (!user) return

  if (action === 'add') user.points += points
  else if (action === 'set') user.points = points

  const currentLevel = await Level.findOne({
    where: {
      pointsRequired: {
        [Op.lte]: user.points,
      },
    },
    order: [['pointsRequired', 'DESC']],
  })

  if (currentLevel) {
    if (currentLevel.title !== user.title) {
      notifyLevelUp(user.id, currentLevel.title)
    }
    user.level = currentLevel.level
    user.title = currentLevel.title
  }

  await user.save()

  await PointHistory.create({
    userId: user.id,
    points,
    fromSystem: options.fromSystem,
    description: options.description,
    fromUserId: options.fromUserId,
    type: points < 0 ? 'remove' : action,
  })
}

export default addPointsToUser
