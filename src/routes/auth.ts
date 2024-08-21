import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { body, validationResult } from 'express-validator'
import dotenv from 'dotenv'
import { Op } from 'sequelize'
import dayjs from 'dayjs'
import { generateToken } from '../helpers/helpers'
import { espClient } from '../connectors'
import emailHelper from '../helpers/emailHelper'
import { authenticateToken } from '../middleware/auth'
import { UserDream, User, NicknameChange } from '../models'
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

      res.status(201).send({ message: 'User successfully validated' })
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
    userToValidate.resetPasswordExpires = null
    userToValidate.validated = true
    await userToValidate.save()

    const userJwt = jwt.sign({
      id: userToValidate.id,
      email: userToValidate.email,
      nickname: userToValidate.nickname,
      roleId: userToValidate.roleId,
      isAdmin: userToValidate.roleId === 1,
    }, jwtSecret, { expiresIn: '31d' })

    res.status(201).send({ token: userJwt, message: 'User successfully validated' })
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

      if (!user.validated) {
        return res.status(400).send({ error: 'Compte non validé. Veuillez vérifier votre email et valider votre compte en utilisant le lien envoyé lors de votre inscription. Si vous ne trouvez pas l\'email, pensez à vérifier vos spams ou recherchez un message de "Lisa du Sentier des Rêves".' })
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
  const user = await User.findByPk(req.user.id)
  if (!user) {
    return res.sendStatus(404)
  }
  res.json({
    id: user.id,
    email: user.email,
    oldEmail: user.oldEmail,
    nickname: user.nickname,
    avatar: user.avatar,
    roleId: user.roleId,
    isAdmin: user.roleId === 1,
    lastNicknameChange: user.lastNicknameChange,
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

authRouter.post('/api/auth/reset-password/:token', async (req: Request, res: Response) => {
  const { token } = req.params
  const { password } = req.body

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

    if (!password) {
      return res.status(400).json({ error: 'No new password waa given' })
    }

    user.password = await bcrypt.hash(password, 10)
    user.resetPasswordToken = null
    user.resetPasswordExpires = null

    await user.save()

    res.status(200).json({ message: 'Password has been reset successfully' })
  } catch (error) {
    log.error(error)
    res.status(500).json({ error: 'Error resetting password' })
  }
})

authRouter.post(
  '/api/users/update-nickname',
  [
    body('nickname').notEmpty().withMessage('Username cannot be empty'),
  ],
  authenticateToken,
  async (req: Request, res: Response) => {
    const userId = req.user.id
    const { nickname } = req.body

    try {
      const existingUser = await User.findOne({ where: { nickname } })
      if (existingUser) {
        return res.status(400).json({ error: 'Pseudo indisponible' })
      }

      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' })
      }

      const sixMonthsAgo = dayjs().subtract(6, 'months')
      if (user.lastNicknameChange
        && dayjs(user.lastNicknameChange).isAfter(sixMonthsAgo)
        && user.roleId !== 1) {
        return res.status(400).json({
          error: 'Vous ne pouvez changer de pseudo qu\'une fois tous les 6 mois',
        })
      }

      user.nickname = nickname
      user.lastNicknameChange = new Date()

      await user.save()

      log.info(`${req.user.nickname} has changed his nickname to ${nickname}`)

      await NicknameChange.create({
        userId: req.user.id,
        oldNickname: req.user.nickname,
        newNickname: nickname,
      })
      req.user.nickname = nickname

      return res.status(200).json({ message: 'Pseudo mis à jour avec succès' })
    } catch (error) {
      log.error('Erreur lors de la mise à jour du pseudo:', error)
      return res.status(500).json({ error: 'Erreur lors de la mise à jour du pseudo' })
    }
  },
)

authRouter.post(
  '/api/users/change-email',
  [
    body('email').notEmpty().isEmail().isLength({ min: 5 }).withMessage('Email must be valid'),
  ],
  authenticateToken,
  async (req: Request, res: Response) => {
    const userId = req.user.id
    const { email } = req.body

    try {
      const existingUser = await User.findOne({ where: { email } })
      if (existingUser) {
        return res.status(400).json({ error: 'Email indisponible' })
      }

      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' })
      }

      if (user.email === email) {
        return res.status(400).json({ error: 'Vous ne pouvez pas changer votre email par votre adresse e-mail déjà lié à votre compte.' })
      }

      if (!user.validated) {
        return res.status(400).json({ error: 'Votre adresse e-mail est déjà en cours de changement. Veuille valider le lien reçu par email.' })
      }

      const newToken = generateToken()
      log.debug('new token', newToken)
      log.debug('old token', user.resetPasswordToken)
      user.oldEmail = user.email
      user.email = email
      user.validated = false
      user.resetPasswordToken = newToken

      await user.save()

      log.info(`${req.user.nickname} has changed his email from ${user.oldEmail} to ${user.email}`)
      const emailOptions = {
        to: {
          email: user.oldEmail,
          name: user.nickname,
        },
        variables: {
          validationUrl: `${process.env.WEBSITE_URL}/users/validate/${newToken}`,
        },
      }

      await emailHelper.sendEmailChange(emailOptions, espClient)

      return res.status(200).json({ message: 'Email mise à jour avec succès' })
    } catch (error) {
      log.error('Erreur lors de la mise à jour de l\'email:', error)
      return res.status(500).json({ error: 'Erreur lors de la mise à jour de votre email' })
    }
  },
)

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

    const totalDreams = user?.dreams?.length ?? 0
    const publicDreams = user?.dreams?.filter(s => s.privacy === 'public').length ?? 0
    const totalViews = user?.dreams?.reduce((
      sum: number,
      dream: UserDream,
    ) => sum + dream.views, 0) ?? 0

    res.json({
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
      isAdmin: user.roleId === 1,
      validated: user.validated,
      points: user.points,
      createdAt: user.createdAt,
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
