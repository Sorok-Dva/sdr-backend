import { promises as fsp } from 'fs'
import * as path from 'path'

import { FileNotFoundError } from '../errors'

/**
 * Retrieve a file's content from the filesystem.
 *
 * @memberof fsHelper
 * @module fsHelper
 * @function
 * @param filename - Local filename.
 * @param localPath - Attachment local path.
 * @param encoding - File content output encoding.
 * @returns The file content.
 */
const readFile = async (
  filename: string,
  localPath: string,
  encoding: BufferEncoding,
): Promise<string> => {
  const filePath = path.join(localPath, filename)

  try {
    const file = await fsp.readFile(filePath, { encoding })
    return file
  } catch (error) {
    throw new FileNotFoundError(filePath)
  }
}

/**
 * Retrieve a file's content from the filesystem as base64.
 *
 * @memberof fsHelper
 * @module fsHelper
 * @function
 * @param filename - Local filename.
 * @param localPath - Attachment local path.
 * @returns The file content.
 */
const readFileToBase64 = async (
  filename: string,
  localPath: string,
): Promise<string> => readFile(filename, localPath, 'base64')

/**
 * Retrieve a file's content from the filesystem as utf-8.
 *
 * @memberof fsHelper
 * @module fsHelper
 * @function
 * @param filename - Local filename.
 * @param localPath - Attachment local path.
 * @returns The file content.
 */
const readFileToUtf8 = async (
  filename: string,
  localPath: string,
): Promise<string> => readFile(filename, localPath, 'utf-8')

export default {
  readFile,
  readFileToBase64,
  readFileToUtf8,
}
