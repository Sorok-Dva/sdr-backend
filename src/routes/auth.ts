import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { body, validationResult } from 'express-validator'
import dotenv from 'dotenv'
import { Op } from 'sequelize'
import WebSocket from 'ws'
import { authenticateToken } from '../middleware/auth'
import { UserDream, User } from '../models'

const wsClient = new WebSocket.Server({ port: 4242 })

dotenv.config()

const authRouter = express.Router()

const jwtSecret = process.env.JWT_SECRET || 'default_secret'

authRouter.post(
  '/api/users/register',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { email, password, nickname } = req.body

      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            { email },
            { nickname },
          ],
        },
      })

      if (existingUser) {
        return res.status(400).send({ error: 'Email or nickname already used.' })
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await User.create({
        email,
        roleId: 2,
        password: hashedPassword,
        nickname,
        validated: false,
      })
      const userJwt = jwt.sign({
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        roleId: user.roleId,
        isAdmin: user.roleId === 1,
      }, jwtSecret, { expiresIn: '31d' })

      res.status(201).send({ token: userJwt })
    } catch (error: any) {
      res.status(500).send({ error })
    }
  },
)

authRouter.post(
  '/api/users/login',
  [
    body('username').notEmpty().withMessage('Username cannot be empty'),
    body('password').notEmpty().withMessage('Password cannot be empty'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { username, password } = req.body

      const user = await User.findOne({
        where: {
          [Op.or]: [
            { email: username },
            { nickname: username },
          ],
        },
      })
      if (!user) {
        return res.status(400).send({ error: 'Invalid credentials' })
      }
      const passwordsMatch = await bcrypt.compare(password, user.password)
      if (!passwordsMatch) {
        return res.status(400).send({ error: 'Invalid credentials' })
      }

      const userJwt = jwt.sign({
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        roleId: user.roleId,
        isAdmin: user.roleId === 1,
      }, jwtSecret, { expiresIn: '31d' })

      res.status(200).send({ token: userJwt })

      if (wsClient && wsClient.readyState === WebSocket.OPEN) {
        wsClient.send(JSON.stringify({
          event: 'login',
          data: {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            avatar: user.avatar,
            roleId: user.roleId,
            isAdmin: user.roleId === 1,
            token: userJwt,
          },
        }))
      }
    } catch (error: any) {
      res.status(500).send({ error })
    }
  },
)

authRouter.get('/api/users/me', authenticateToken, async (req: Request, res: Response) => {
  const user = await User.findByPk(req.user!.id)
  if (!user) {
    return res.sendStatus(404)
  }
  res.json({
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    avatar: user.avatar,
    roleId: user.roleId,
    isAdmin: user.roleId === 1,
    validated: user.validated,
  })
})

authRouter.get('/api/user/profile/:nickname', authenticateToken, async (req: Request, res: Response) => {
  const { nickname } = req.params

  try {
    const user = await User.findOne({
      where: { nickname },
      include: [{
        model: UserDream,
        as: 'userDreams',
        attributes: ['id', 'privacy', 'views', 'deletedAt'],
        where: {
          deletedAt: {
            [Op.is]: null,
          },
        },
        required: false,
      }],
    })

    if (!user) {
      return res.sendStatus(404)
    }

    const totalDreams = user?.dreams?.length
    const publicDreams = user?.dreams?.filter(s => s.privacy === 'public').length
    const totalViews = user?.dreams?.reduce((
      sum: number,
      dream: UserDream,
    ) => sum + dream.views, 0)

    res.json({
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
      isAdmin: user.roleId === 1,
      validated: user.validated,
      totalDreams,
      publicDreams,
      totalViews,
    })
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

export default authRouter
