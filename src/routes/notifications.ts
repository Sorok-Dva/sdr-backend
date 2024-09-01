import express, { Request, Response } from 'express'
import addPointsToUser from '../utils/addPointsToUser'

const notifRouter = express.Router()
const sessions = new Map<number, { notify:(data: any) => void }>()

notifRouter.get('/', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const userId = parseInt(req.query.userId as string, 10)

  const notify = (data: unknown) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  sessions.set(userId, { notify })

  req.on('close', () => {
    sessions.delete(userId)
    res.end()
  })
})

notifRouter.get('/test', async (req: Request, res: Response) => {
  await addPointsToUser(1, 100, {
    fromSystem: false,
    fromUserId: req?.user?.id ?? null,
    description: 'Votre solde de points a été modifié pour un test',
  })
  await addPointsToUser(1, -100, {
    fromSystem: false,
    fromUserId: req?.user?.id ?? null,
    description: 'Votre solde de points a été modifié pour un test',
  })
  res.status(200).send('ok')
})

const notifyLevelUp = (userId: number, title: string) => {
  const session = sessions.get(userId)
  if (session?.notify) {
    session.notify({ event: 'levelUp', userId, title })
  }
}

const notifyWinPoints = (userId: number, points: number, loss: boolean) => {
  const session = sessions.get(userId)
  if (session?.notify) {
    session.notify({ event: loss ? 'lossPoints' : 'winPoints', userId, points })
  }
}

export {
  notifyLevelUp,
  notifyWinPoints,
}
export default notifRouter
