/**
 * ESP file Attachement properties.
 *
 * @alias EmailAttachment
 * @memberof EmailSendingOptions
 */
export type EmailAttachment = {
  /** Content-Type of attachment element */
  contentType: string

  /** Original filename of the attached file */
  filename: string

  /** Unique id in email template */
  contentId: string

  /** Attachement content in base64 */
  base64Content?: string
}

/**
 * Standard ESP Response.
 *
 * @alias EspResponse
 */
// TODO: Improve signature
export type EspResponse = {
  readonly response: unknown
}

/**
 * Define an ESP mailbox.
 *
 * @memberof EmailSendingOptions
 * @alias Mailbox
 */
export type Mailbox = {
  /** The email address */
  email: string

  /** The display name of the mailbox owner */
  name: string
}

/**
 * Define an ESP recipients.
 *
 * @alias Recipients
 */
export type Recipients = {
  /** Sender mailbox */
  to: Mailbox

  /** additional receivers */
  cc?: Array<Mailbox>

  /** additional black carbon copy receivers */
  bcc?: Array<Mailbox>
}

/**
 * Definition of ESP email sending parameters.
 *
 * @interface
 */
export interface EmailSendingOptions extends Recipients {
  /** Sender mailbox */
  from?: Mailbox

  /** email template configuration variables */
  variables?: Record<string, unknown>

  /** email subject */
  subject?: string

  /** text template */
  textPart?: string

  /** html template */
  htmlPart?: string

  /** email attachments */
  attachments?: Array<EmailAttachment>
}

/**
 * Email Service Provider Client Connector Interface.
 *
 * @interface
 */
export interface EspClient {
  /**
   * Send emails throught the ESP.
   *
   * @memberof EspClient
   * @function
   * @param options - All required parameters to send the emails.
   * @returns A promise with the client response.
   */
  send: (options: EmailSendingOptions) => Promise<EspResponse>
}
