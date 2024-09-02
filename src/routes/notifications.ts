import express, { Request, Response } from 'express'
import addPointsToUser from '../utils/addPointsToUser'

const notifRouter = express.Router()
const sessions = new Map<string, { notify:(data: any) => void }>()

notifRouter.get('/', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const { token } = req.query

  const notify = (data: unknown) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  if (typeof token === 'string') {
    sessions.set(token, { notify })

    req.on('close', () => {
      sessions.delete(token)
      res.end()
    })
  }
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

const notifyLevelUp = (token: string, title: string) => {
  const session = sessions.get(token)
  if (session?.notify) {
    session.notify({ event: 'levelUp', token, title })
  }
}

const notifyWinPoints = (token: string, points: number, loss: boolean) => {
  const session = sessions.get(token)
  if (session?.notify) {
    session.notify({ event: loss ? 'lossPoints' : 'winPoints', token, points })
  }
}

export {
  notifyLevelUp,
  notifyWinPoints,
}
export default notifRouter
