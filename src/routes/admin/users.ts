import express, { Request, Response } from 'express'
import { Sequelize } from 'sequelize'
import { body } from 'express-validator'
import { Role, UserDream, User, NicknameChange } from '../../models'
import { authenticateToken, isAdmin } from '../../middleware/auth'
import addPointsToUser from '../../utils/addPointsToUser'

const router = express.Router()

router.use(authenticateToken)
router.use(isAdmin)

router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: {
        include: [
          [
            Sequelize.fn(
              'COUNT',
              Sequelize.literal(
                'CASE WHEN dreams.deletedAt IS NULL THEN dreams.id ELSE NULL END',
              ),
            ),
            'dreamsCount',
          ],
        ],
        exclude: ['password'],
      },
      include: [
        {
          model: UserDream,
          as: 'dreams',
          attributes: [],
        },
      ],
      group: ['User.id'],
    })

    return res.status(200).json(users)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Failed to fetch users' })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const user = await User.findOne({
      where: { id },
      attributes: {
        include: [
          // Count the number of non-deleted dreams for each user
          [
            Sequelize.fn(
              'COUNT',
              Sequelize.literal(
                'CASE WHEN dreams.deletedAt IS NULL THEN dreams.id ELSE NULL END',
              ),
            ),
            'dreamsCount',
          ],
          // Sum the views of non-deleted userDreams belonging to the user
          [
            Sequelize.fn(
              'SUM',
              Sequelize.literal(
                'CASE WHEN dreams.deletedAt IS NULL THEN dreams.views ELSE 0 END',
              ),
            ),
            'totalViews',
          ],
        ],
        exclude: [
          'password',
          'resetPasswordToken',
          'roleId',
        ],
      },
      include: [
        {
          model: UserDream,
          as: 'dreams',
          attributes: [],
        },
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'name'],
        },
        {
          model: NicknameChange,
          as: 'nicknameChanges',
          attributes: ['oldNickname', 'newNickname', 'createdAt'],
        },
      ],
      group: ['User.id', 'role.id', 'nicknameChanges.id'],
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    return res.status(200).json(user)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to fetch user' })
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    if (req.body.points && user.points !== req.body.points) {
      await addPointsToUser(user.id, req.body.points, {
        fromSystem: false,
        fromUserId: req.user.id,
        description: 'Votre solde de points a été modifié par l\'équipe de modération',
      }, 'set')
      delete req.body.points
    }
    await user.update(req.body)
    return res.status(200).json(user)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Failed to update user' })
  }
})

router.post(
  '/:id/add-points',
  [
    body('points').notEmpty().isNumeric().withMessage('Points must be numeric'),
  ],
  async (req: Request, res: Response) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }
      if (req.body.points && user.points !== req.body.points) {
        await addPointsToUser(user.id, req.body.points, {
          fromSystem: false,
          fromUserId: req.user.id,
          description: req.body.points < 0
            ? 'Vous avez perdu des points de la part de l\'équipe de modération'
            : 'Vous avez gagné des points de la part de l\'équipe de modération',
        }, 'add')
      }
      return res.status(200).json({
        ...user,
        points: user.points + req.body.points,
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({ error: 'Failed to update user points' })
    }
  },
)

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    await user.destroy()
    return res.status(204).send()
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete user' })
  }
})

export { router as adminUsersRouter }
