import express, { Request, Response } from 'express'
import { authenticateToken, isAdmin } from '../../middleware/auth'
import { Tutorial } from '../../models'

const router = express.Router()

router.use(authenticateToken)
router.use(isAdmin)

router.post('/', async (req : Request, res : Response) => {
  const { title, categoryId, content } = req.body
  const userId = req.user.id

  try {
    const newTutorial = await Tutorial.create({
      userId,
      categoryId,
      title,
      content,
      views: 0,
      validated: false,
    })

    res.status(201).json(newTutorial)
  } catch (error) {
    console.error('Error while creating tutorial', error)
    res.status(500).json({ error: 'Error while creating tutorial' })
  }
})

export { router as adminTutorialsRouter }
