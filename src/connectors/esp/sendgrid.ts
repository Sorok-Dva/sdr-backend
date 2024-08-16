// import { env } from '@materya/carbon'
// import sendgrid from '@sendgrid/mail'

// import type {
//   EmailSendingOptions,
//   EspClient,
//   EspResponse,
// } from '../../lib/espClient'

// import { logger } from '../../lib'

// const log = logger('sendgrid')

// const apiKey = env.get('SENDGRID_API_KEY')

// sendgrid.setApiKey(apiKey)

// const send = async (options: EmailSendingOptions): Promise<EspResponse> => {
//   const { to, from, variables } = options
//   const payload = {
//     to: `${to.name} <${to.email}>`,
//     from: `${from?.name} <${from?.email}>`,
//     subject: options.subject,
//     text: options.textPart,
//     html: options.htmlPart,
//     ...(variables && {
//       substitutions: Object.entries(variables).reduce((vars, [k, v]) => ({
//         ...vars,
//         [`var:${k}`]: v,
//       }), {}),
//     }),
//   }
//   log.debug('payload', payload)

//   try {
//     const response = await sendgrid.send(payload)
//     log.debug('response', response)

//     return response[0]
//   } catch (error) {
//     log.error(error)
//     throw error
//   }
// }

// const sendgridClient: EspClient = {
//   send,
// }

// export default sendgridClient
