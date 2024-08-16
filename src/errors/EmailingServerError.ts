import HttpError from './HttpError'

/**
 * Raise if an error occurred in email sending
 *
 * @augments HttpError
 */
export default class EmailingServerError extends HttpError {
  public readonly error: Error

  /**
   * Instantiate the error with default properties.
   *
   * @param {Error} error - HTTP method used to access resource.
   */
  constructor (error: Error) {
    super(500, 'emailing_server_error', error.message)

    this.error = error
  }
}
