import { Op } from 'sequelize'
import { notifyLevelUp } from '../routes/notifications'
import { User, Level } from '../models'

const addPointsToUser = async (
  userId: number,
  points: number,
): Promise<void> => {
  const user = await User.findByPk(userId)
  if (!user) return

  user.points += points

  const currentLevel = await Level.findOne({
    where: {
      pointsRequired: {
        [Op.lte]: user.points,
      },
    },
    order: [['pointsRequired', 'DESC']],
  })

  if (currentLevel) {
    user.level = currentLevel.level
    user.title = currentLevel.title

    notifyLevelUp(user.id, user.title)
  }

  notifyLevelUp(user.id, user.title)
  await user.save()
}

export default addPointsToUser
