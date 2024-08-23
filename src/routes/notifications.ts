import express, { Request, Response } from 'express'

const notifRouter = express.Router()
const sessions = new Map<number, { notify:(data: any) => void }>()

notifRouter.get('/', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const userId = parseInt(req.query.userId as string, 10)

  const notify = (data: unknown) => {
    console.log(`data: ${JSON.stringify(data)}\n\n`)
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  sessions.set(userId, { notify })

  req.on('close', () => {
    sessions.delete(userId)
    res.end()
  })
})

const notifyLevelUp = (userId: number, title: string) => {
  console.log('notifyLevelUp')
  const session = sessions.get(userId)
  console.log('session', session)
  if (session?.notify) {
    // session.notify({ userId, title })
    const data = JSON.stringify({ userId, title })
    session.notify(`data: ${data}\n\n`)
    console.log('notified')
  }
}

export {
  notifyLevelUp,
}
export default notifRouter
