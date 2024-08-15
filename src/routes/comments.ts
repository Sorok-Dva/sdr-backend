import express, { Request, Response } from 'express'
import { Op } from 'sequelize'
import {
  authenticateToken,
} from '../middleware/auth'
import { Comment, CommentUpvote, User } from '../models'

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

    res.status(201).json(fullComment)
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

    const existingUpvote = await CommentUpvote.findOne({
      where: { userId, commentId: id },
    })

    if (existingUpvote) {
      comment.upvote -= 1
      await comment.save()
      await existingUpvote.destroy()
      return res.status(200).json(comment)
    }

    await CommentUpvote.create({ userId, commentId: parseInt(id, 10) })
    comment.upvote += 1
    await comment.save()
    res.status(200).json(comment)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to upvote comment' })
  }
})

export default commentRouter
