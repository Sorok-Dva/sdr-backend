import express, { Request, Response } from 'express'
import { Op } from 'sequelize'
import {
  authenticateToken,
} from '../middleware/auth'
import { Comment, Upvote, User } from '../models'
import addPointsToUser from '../utils/addPointsToUser'
import game from '../../config/game.json'

const commentRouter = express.Router()

commentRouter.get('/:tutorialId', async (req: Request, res: Response) => {
  try {
    const { tutorialId } = req.params
    const comments = await Comment.findAll({
      where: {
        tutorialId,
        deletedAt: { [Op.is]: null },
      },
      include: {
        model: User,
        as: 'user',
        attributes: ['nickname', 'avatar'],
      },
    })
    res.json(comments)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' })
  }
})

commentRouter.use(authenticateToken)

commentRouter.post('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user.id
    const { tutorialId, content } = req.body

    const comment = await Comment.create({
      userId,
      tutorialId,
      content,
    })

    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: {
        model: User,
        as: 'user',
        attributes: ['nickname', 'avatar'],
      },
    })

    await addPointsToUser(req.user.id, game.actions.points.add.COMMENT, {
      fromSystem: true,
      description: 'Vous avez commenté un tutoriel',
    })

    return res.status(201).json(fullComment)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to add comment' })
  }
})

commentRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { content, upvote } = req.body
    const [updated] = await Comment.update(
      { content, upvote },
      { where: { id, deletedAt: { [Op.is]: null } } },
    )
    if (updated) {
      const updatedComment = await Comment.findOne({ where: { id } })
      res.status(200).json(updatedComment)
    } else {
      res.status(404).json({ error: 'Comment not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update comment' })
  }
})

commentRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const comment = await Comment.findByPk(id)

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' })
    }
    comment.deletedAt = new Date()
    await comment.save()

    res.status(204)
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' })
  }
})

commentRouter.post('/:id/upvote', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const comment = await Comment.findByPk(id)

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' })
    }

    const existingUpvote = await Upvote.findOne({
      where: { userId, commentId: id, deletedAt: null },
    })

    if (existingUpvote) {
      comment.upvote -= 1
      existingUpvote.deletedAt = new Date()
      await comment.save()
      await existingUpvote.save()
      return res.status(200).json(comment)
    }

    // gamification
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const votesTodayCount = await Upvote.count({
      where: {
        userId: req.user.id,
        createdAt: {
          [Op.gte]: today,
        },
      },
    })

    if (votesTodayCount < 10) {
      await addPointsToUser(req.user.id, game.actions.points.add.ADD_VOTE, {
        fromSystem: true,
        description: 'Vous avez voté pour un commentaire',
      })
    }

    await Upvote.create({ userId, commentId: parseInt(id, 10) })
    comment.upvote += 1
    await comment.save()
    res.status(200).json(comment)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to upvote comment' })
  }
})

export default commentRouter
