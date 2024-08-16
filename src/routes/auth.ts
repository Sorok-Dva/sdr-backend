import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { body, validationResult } from 'express-validator'
import dotenv from 'dotenv'
import { Op } from 'sequelize'
import { generateToken } from '../helpers/helpers'
import { espClient } from '../connectors'
import emailHelper from '../helpers/emailHelper'
import { authenticateToken } from '../middleware/auth'
import { UserDream, User } from '../models'
import { logger } from '../lib'

dotenv.config()

const authRouter = express.Router()
const log = logger('user')

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
        resetPasswordToken: generateToken(),
        validated: false,
      })
      const userJwt = jwt.sign({
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        roleId: user.roleId,
        isAdmin: user.roleId === 1,
      }, jwtSecret, { expiresIn: '31d' })

      const emailOptions = {
        to: {
          email,
          name: user.nickname,
        },
        variables: {
          validationUrl: `${process.env.WEBSITE_URL}/users/validate/${user.resetPasswordToken}`,
        },
      }

      await emailHelper.sendWelcomeEmail(emailOptions, espClient)

      res.status(201).send({ token: userJwt })
    } catch (error: unknown) {
      log.error(error)
      res.status(500).send({ error })
    }
  },
)

authRouter.get('/api/users/validate/:token', async (req: Request, res: Response) => {
  try {
    const { token } = req.params

    const userToValidate = await User.findOne({
      where: {
        resetPasswordToken: token,
      },
    })

    if (!userToValidate) {
      return res.status(400).send({ error: 'Invalid token' })
    }

    userToValidate.resetPasswordToken = null
    userToValidate.validated = true
    await userToValidate.save()

    res.status(201).send({ message: 'User successfully validated' })
  } catch (error: unknown) {
    log.error(error)
    res.status(500).send({ error })
  }
})

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
    } catch (error: unknown) {
      log.error(error)
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

authRouter.post(
  '/api/auth/forgot-password',
  [
    body('email').isEmail().withMessage('L\'adresse email doit être valide.'),
  ],
  async (req: Request, res: Response) => {
    const { email } = req.body

    try {
      const user = await User.findOne({ where: { email } })

      if (!user) {
        return res.status(400).json({ error: 'Invalid parameter.' })
      }

      const token = generateToken()
      const resetLink = `${process.env.WEBSITE_URL}/reset-password/${token}`

      user.resetPasswordToken = token
      user.resetPasswordExpires = new Date(Date.now() + 3600000) // 1 hour from now
      await user.save()

      const emailOptions = {
        to: {
          email,
          name: user.nickname,
        },
        variables: {
          validationUrl: resetLink,
        },
      }

      await emailHelper.sendResetPasswordEmail(emailOptions, espClient)

      return res.status(200).json({ message: 'Password reset link sent to your email' })
    } catch (error) {
      log.error(error)
      return res.status(500).json({ error: 'Error sending password reset email' })
    }
  },
)

authRouter.post('/reset-password/:token', async (req: Request, res: Response) => {
  const { token } = req.params
  const { newPassword } = req.body

  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    })

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' })
    }

    user.password = await bcrypt.hash(newPassword, 10)
    user.resetPasswordToken = null
    user.resetPasswordExpires = null

    await user.save()

    res.status(200).json({ message: 'Password has been reset successfully' })
  } catch (error) {
    log.error(error)
    res.status(500).json({ error: 'Error resetting password' })
  }
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
    log.error(error)
    res.sendStatus(500)
  }
})

export default authRouter
