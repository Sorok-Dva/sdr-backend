/**
 * Default HTTP Error Constructor.
 *
 * It is highly adviced to extends from instead of calling it directly.
 *
 * @augments BaseError
 */
export default class HttpError extends Error {
  public readonly codeName: string

  public readonly statusCode: number

  /**
   * Instantiate the error with default properties.
   *
   * @param {number} statusCode - Standard HTTP Status Code.
   * @param {string} codeName - Application domain error code.
   * @param {string} [message] - Human readable error message.
   */
  constructor (
    statusCode: number,
    codeName: string,
    message?: string,
  ) {
    const endMessage = message ?? 'unexpected error'
    super(`HTTP Error ${statusCode} (${codeName}): ${endMessage}`)

    this.codeName = codeName
    this.statusCode = statusCode
  }
}
