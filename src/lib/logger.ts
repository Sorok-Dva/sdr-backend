import debug from 'debug'

const { SERVICE_NAME = 'app' } = process.env

const log = debug(SERVICE_NAME)

const levels = [
  'debug',
  'error',
  'info',
  'warn',
] as const

type LogLevels = Pick<Console, typeof levels[number]>

export type Logger = LogLevels

export const logger = (
  context: string,
): Logger => levels.reduce<LogLevels>((logs, level) => {
  const extend = `${context} [${level.toUpperCase()}]`
  const binding = log.extend(extend)
  // eslint-disable-next-line no-console
  binding.log = console[level].bind(console)

  return { ...logs, [level]: binding }
}, {} as LogLevels)
