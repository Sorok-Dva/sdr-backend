import { Op } from 'sequelize'
import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { UserDream } from '../models'
import addPointsToUser from '../utils/addPointsToUser'
import game from '../../config/game.json'
import { logger } from '../lib'

const log = logger('dreams')

const createDream = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { title, content, privacy } = req.body

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dreamsTodayCount = await UserDream.count({
      where: {
        userId: req.user.id,
        createdAt: {
          [Op.gte]: today,
        },
      },
    })

    const dream = await UserDream.create({
      userId: req.user.id,
      title,
      content,
      privacy: privacy || 'private',
    })

    if (dreamsTodayCount === 0) {
      await addPointsToUser(req.user.id, game.actions.points.add.ADD_DREAM)
    }

    res.status(201).send(dream)
  } catch (error: unknown) {
    log.error('Error creating dream:', error)
    res.status(500).send({ error })
  }
}

const getLastDream = async (req: Request, res: Response) => {
  const dream = await UserDream.findOne({
    where: {
      userId: req.user.id,
      deletedAt: { [Op.is]: null },
    },
    order: [['createdAt', 'DESC']],
  })
  const count = await UserDream.count({
    where: {
      userId: req.user.id,
      deletedAt: { [Op.is]: null },
    },
  })
  return res.json({ ...dream?.dataValues, total: count })
}

const getMyDreams = async (req: Request, res: Response) => {
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
}

const getPublicDreams = async (req: Request, res: Response) => {
  const dreams = await UserDream.findAll({
    where: {
      privacy: 'public',
      deletedAt: { [Op.is]: null },
    },
  })
  return res.json(dreams)
}

export default {
  createDream,
  getLastDream,
  getMyDreams,
  getPublicDreams,
}
