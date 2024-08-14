import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import dotenv from 'dotenv'
import { Op } from 'sequelize'
import {
  authenticateOptionalToken,
  authenticateToken,
} from '../middleware/auth'
import { UserDream } from '../models'

dotenv.config()

const dreamsRouter = express.Router()

dreamsRouter.get('/', authenticateOptionalToken, async (req: Request, res: Response) => {
  const dreams = await UserDream.findAll({
    where: {
      privacy: 'public',
      deletedAt: { [Op.is]: null },
    },
  })
  return res.json(dreams)
})

dreamsRouter.get('/my', authenticateToken, async (req: Request, res: Response) => {
  const dreams = await UserDream.findAll({
    where: {
      userId: req.user.id,
      deletedAt: { [Op.is]: null },
    },
  })
  return res.json(dreams.map(dream => {
    const date = new Date(dream.createdAt)
    const formattedDate = date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    return {
      title: dream.title,
      date: formattedDate,
      content: dream.content,
    }
  }))
})

dreamsRouter.post(
  '/',
  authenticateToken,
  [
    body('title').isLength({ min: 4, max: 20 }).withMessage('Title must be at least 5 characters long'),
    body('content').isLength({ min: 5 }).withMessage('Description must be at least 5 characters long'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { title, content, privacy } = req.body

      const dream = await UserDream.create({
        userId: req.user.id,
        title,
        content,
        privacy: privacy || 'public',
        // category: 'joy',
      })

      res.status(201).send(dream)
    } catch (error: unknown) {
      res.status(500).send({ error })
    }
  },
)
export default dreamsRouter
