import path from 'path'
import { logger } from '../lib'
import type {
  EmailAttachment,
  EmailSendingOptions,
  EspClient,
  EspResponse,
} from '../lib/espClient'
import { EmailingServerError } from '../errors'
import { fsHelper } from '.'

const emailsAssetsPath = path.join(__dirname, '../../assets/emails')

const templatesPath = `${emailsAssetsPath}/templates`

/**
 * Retrieve an inline attachment.
 *
 * @module emailHelper
 * @function
 * @param filename - Attachment filename in local path.
 * @param contentId - Attachment unique identifier in email template.
 * @param localPath - Attachment local path.
 * @param contentType - Attachment content-type.
 * @returns - A full attachment object.
 */
const getAttachment = async (
  filename: string,
  contentId: string,
  localPath: string,
  contentType: string,
): Promise<EmailAttachment> => {
  const base64Content: string = await fsHelper
    .readFileToBase64(filename, localPath)

  return {
    contentType,
    filename,
    contentId,
    base64Content,
  }
}

const send = async (
  options: EmailSendingOptions,
  client: EspClient,
): Promise<EspResponse> => {
  const defaultSubject = 'Email de Lisa du Sentier des Rêves'
  const layout = await fsHelper.readFileToUtf8('default.tpl.html', templatesPath)

  const htmlContent = layout
    .replace('{{var:title}}', options.subject ?? defaultSubject)
    .replace('{{var:headline}}', options.subject ?? defaultSubject)
    .replace('{{var:content}}', options.htmlPart ?? '')
    .replace('{{var:preheader}}', options.subject ?? defaultSubject)

  const reducedOptions: EmailSendingOptions = {
    from: {
      email: process.env.EMAIL_SENDER_ADDRESS ?? options.from?.email ?? '',
      name: process.env.EMAIL_SENDER_NAME ?? options.from?.name ?? '',
    },
    ...options,
    htmlPart: htmlContent,
  }

  try {
    return await client.send(reducedOptions)
  } catch (e) {
    throw new EmailingServerError(e as Error)
  }
}

/**
 * Trigger a welcome email.
 *
 * @module emailHelper
 * @function
 * @param options - Sending options.
 * @param client - Email Service Provider client.
 * @returns - mailjet email response
 */
const sendWelcomeEmail = async (
  options: EmailSendingOptions,
  client: EspClient,
): Promise<EspResponse> => {
  const tpl = await fsHelper.readFileToUtf8('register.tpl.html', templatesPath)
  const reducedOptions = {
    subject: 'Inscription sur Le Sentier des Rêves !',
    htmlPart: tpl,
    ...options,
  }

  return send(reducedOptions, client)
}

/**
 * Trigger a change email notif.
 *
 * @module emailHelper
 * @param {EmailSendingOptions} options - Sending options.
 * @param {EspClient} client - Email Service Provider client.
 */
const sendEmailChange = async (
  options: EmailSendingOptions,
  client: EspClient,
): Promise<EspResponse> => {
  const tpl = await fsHelper.readFileToUtf8(
    'mail_changed.tpl.html',
    templatesPath,
  )
  const reducedOptions = {
    subject: 'Confirmation d\'email',
    htmlPart: tpl,
    ...options,
  }

  return send(reducedOptions, client)
}

/**
 * Trigger a reset password email.
 *
 * @module emailHelper
 * @function
 * @param options Sending options.
 * @param client Email Service Provider client.
 * @returns mailjet email response
 */
const sendResetPasswordEmail = async (
  options: EmailSendingOptions,
  client: EspClient,
): Promise<EspResponse> => {
  const tpl = await fsHelper.readFileToUtf8(
    'password-reset.tpl.html',
    templatesPath,
  )
  const reducedOptions = {
    subject: 'Le Sentier des Rêves - Changez votre mot de passe',
    htmlPart: tpl,
    ...options,
  }

  return send(reducedOptions, client)
}

export default {
  getAttachment,
  send,
  sendWelcomeEmail,
  sendEmailChange,
  sendResetPasswordEmail,
}
