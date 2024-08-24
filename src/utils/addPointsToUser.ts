import { Op } from 'sequelize'
import { notifyLevelUp } from '../routes/notifications'
import { User, Level } from '../models'

const addPointsToUser = async (
  userId: number,
  points: number,
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
    if (currentLevel.title !== user.title) notifyLevelUp(user.id, user.title)
    user.level = currentLevel.level
    user.title = currentLevel.title
  }

  await user.save()
}

export default addPointsToUser
