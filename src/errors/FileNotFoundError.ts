/**
 * If a file required is not found.
 */
export default class FileNotFoundError extends Error {
  public readonly file: string

  /**
   * Instantiate the error with default properties.
   *
   * @param {string} file - full path of the file.
   */
  constructor (file: string) {
    super(`File ${file} not found.`)

    this.file = file
  }
}
