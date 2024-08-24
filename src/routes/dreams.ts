import express from 'express'
import { body } from 'express-validator'
import {
  authenticateOptionalToken,
  authenticateToken,
} from '../middleware/auth'
import dreamController from '../controllers/dream'

const dreamsRouter = express.Router()

dreamsRouter.get(
  '/',
  authenticateOptionalToken,
  dreamController.getPublicDreams,
)

dreamsRouter.use(authenticateToken)
dreamsRouter.get(
  '/my',
  dreamController.getMyDreams,
)

dreamsRouter.get(
  '/my/last',
  dreamController.getLastDream,
)

dreamsRouter.post(
  '/',
  [
    body('title').isLength({ min: 3, max: 50 }).withMessage('Le titre doit contenir entre 5 et 50 caractères.'),
    body('content').isLength({ min: 5 }).withMessage('La description doit contenir au moins 5 caractères.'),
  ],
  dreamController.createDream,
)

export default dreamsRouter
