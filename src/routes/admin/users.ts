import express, { Request, Response } from 'express'
import { Sequelize } from 'sequelize'
import { Role, UserDream, User, NicknameChange } from '../../models'
import { authenticateToken, isAdmin } from '../../middleware/auth'

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
                'CASE WHEN userDreams.deletedAt IS NULL THEN userDreams.id ELSE NULL END',
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
          as: 'userDreams',
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
                'CASE WHEN userDreams.deletedAt IS NULL THEN userDreams.id ELSE NULL END',
              ),
            ),
            'screenshotCount',
          ],
          // Sum the views of non-deleted userDreams belonging to the user
          [
            Sequelize.fn(
              'SUM',
              Sequelize.literal(
                'CASE WHEN userDreams.deletedAt IS NULL THEN userDreams.views ELSE 0 END',
              ),
            ),
            'totalViews',
          ],
        ],
        exclude: ['password', 'roleId'],
      },
      include: [
        {
          model: UserDream,
          as: 'userDreams',
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
    await user.update(req.body)
    return res.status(200).json(user)
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update user' })
  }
})

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
