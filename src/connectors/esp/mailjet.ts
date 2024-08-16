import Mailjet, {
  type Client,
} from 'node-mailjet'

import type {
  EmailSendingOptions,
  EspClient,
  EspResponse,
} from '../../lib/espClient'

import { logger } from '../../lib'
import { EmailingServerError } from '../../errors'

const log = logger('mailjet')

let client: Client

const version = 'v3.1'

const getClient = (): Client => {
  if (!client) {
    const publicKey = process.env.MJ_APIKEY_PUBLIC ?? ''
    const privateKey = process.env.MJ_APIKEY_PRIVATE ?? ''

    client = Mailjet.apiConnect(publicKey, privateKey)
  }
  return client
}

/**
 * Get an AmazonWebService object
 *
 * @module mailjet
 * @property { EmailSendingOptions } options Email options
 * @returns { Promise<EspResponse> } Returns the ESP response
 */
const send = async (options: EmailSendingOptions): Promise<EspResponse> => {
  /* eslint-disable @typescript-eslint/naming-convention */
  const payload = {
    Messages: [{
      From: {
        Email: options.from?.email,
        Name: options.from?.name,
      },
      To: [{
        Email: options.to.email,
        Name: options.to.name,
      }],
      Cc: options.cc,
      Bcc: options.bcc,
      Variables: options.variables,
      TemplateLanguage: true,
      Subject: options.subject,
      TextPart: options.textPart,
      HtmlPart: options.htmlPart,
      InlinedAttachments: options.attachments?.map(
        attachment => ({
          ContentType: attachment.contentType,
          Filename: attachment.filename,
          ContentID: attachment.contentId,
          Base64Content: attachment.base64Content,
        }),
      ),
    }],
  }
  /* eslint-enable @typescript-eslint/naming-convention */
  log.debug('send payload')
  log.debug(payload)

  try {
    const response = await getClient()
      .post('send', { version })
      .request(payload)

    if (!response) {
      throw new Error('Unable to send email')
    }

    log.debug('send response')
    log.debug(response)

    return { response }
  } catch (error) {
    log.error(error)
    throw new EmailingServerError(error as Error)
  }
}

const mailjetClient: EspClient = {
  send,
}

export default mailjetClient
