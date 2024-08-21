import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models'

/**
 * Represents the secret key used for JSON Web Token (JWT) encryption.
 *
 * The `jwtSecret` variable is responsible for storing the secret key used to encrypt and decrypt
 * JSON Web Tokens for authentication and authorization purposes. The value of this variable is obtained
 * from the environment variable `JWT_SECRET`. If the `JWT_SECRET` environment variable is not defined,
 * the `jwtSecret` variable will be assigned the default value of `'default_secret'`.
 *
 * @type {string}
 * @default process.env.JWT_SECRET || 'default_secret'
 */
const jwtSecret = process.env.JWT_SECRET || 'default_secret'

/**
 * Authenticates a token from the authorization header.
 * If the token is valid, sets the user object in the request and calls the next middleware.
 * If the token is invalid or missing, sends a 401 or 403 response accordingly.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!authHeader || !token) {
    return res.sendStatus(401)
  }

  try {
    const user = jwt.verify(token, jwtSecret) as User

    if (user?.id) {
      const dbUser = await User.findByPk(user.id)
      if (!dbUser) {
        return res.sendStatus(403) // User not found
      }
      req.user = dbUser as User
    }
    return next()
  } catch (err) {
    return res.sendStatus(403)
  }
}

/**
 * Authenticates a token from the authorization header.
 * If the token is valid, sets the user object in the request and calls the next middleware.
 * If the token is invalid or missing, just run next().
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
export const authenticateOptionalToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!authHeader || !token) return next()

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user as User
    return next()
  })
}

/**
 * Checks if the authenticated user is an admin.
 *
 * @async
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @param {Express.NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>} - It doesn't return anything.
 * @throws {Error} - If access is denied, an error with status 403 is thrown.
 */
export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const user = await User.findByPk(req.user.id)
  if (user && user.roleId === 1) {
    next()
  } else {
    res.status(403).json({ error: 'Access denied' })
  }
}
