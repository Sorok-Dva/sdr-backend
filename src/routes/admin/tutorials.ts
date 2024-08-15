import express, { Request, Response } from 'express'
import { authenticateToken, isAdmin } from '../../middleware/auth'
import { Tutorial } from '../../models'

const router = express.Router()

router.use(authenticateToken)
router.use(isAdmin)

router.post('/', async (req : Request, res : Response) => {
  const { image, title, categoryId, content } = req.body
  const userId = req.user.id

  try {
    const newTutorial = await Tutorial.create({
      userId,
      image,
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

router.patch('/:id', async (req : Request, res : Response) => {
  const { id } = req.params
  const { image, title, categoryId, content } = req.body

  try {
    const tutorial = await Tutorial.findByPk(id)

    if (!tutorial) return res.status(404).send('Tutorial not found')

    tutorial.image = image || tutorial.image
    tutorial.categoryId = categoryId || tutorial.categoryId
    tutorial.title = title || tutorial.title
    tutorial.content = content || tutorial.content
    tutorial.validated = false

    await tutorial.save()

    return res.status(201).json(tutorial)
  } catch (error) {
    console.error('Error while updating tutorial', error)
    return res.status(500).json({ error: 'Error while updating tutorial' })
  }
})

export { router as adminTutorialsRouter }
