import * as path from 'path'
import mock from 'mock-fs'
import sinon from 'sinon'
import { expect } from 'chai'

import emailHelper from './emailHelper'
import { EmailSendingOptions, EspResponse } from '../lib/espClient'

const emailsAssetsPath = path.join(__dirname, '../../assets/emails')

const imagesPath = `${emailsAssetsPath}/images`

const imgContent = 'data:image/png;base64,content'
const tplContent = '<content>foobar</content>'

describe('[UNIT] emailHelper', () => {
  before(() => {
    mock({
      [emailsAssetsPath]: {
        images: {
          /* eslint-disable @typescript-eslint/naming-convention */
          'heart.png': imgContent,
          'logo.png': imgContent,
          'welcome.png': imgContent,
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        templates: {
          /* eslint-disable @typescript-eslint/naming-convention */
          'template.tpl.html': tplContent,
          'welcome.tpl.html': tplContent,
          'invitation.tpl.html': tplContent,
          /* eslint-enable @typescript-eslint/naming-convention */
        },
      },
    })
  })

  after(() => {
    mock.restore()
  })

  describe('getAttachment* Methods', () => {
    describe('getAttachment', () => {
      it('should return valid email attachment object', async () => {
        const result = await emailHelper.getAttachment(
          'logo.png',
          'logo',
          imagesPath,
          'image/png',
        )

        result.should.deep.equal({
          contentType: 'image/png',
          filename: 'logo.png',
          contentId: 'logo',
          base64Content: Buffer.from(imgContent).toString('base64'),
        })
      })
    })
  })

  describe('send method', () => {
    it('should send all options to the provider', async () => {
      const options: EmailSendingOptions = {
        from: {
          email: 'sender@tests.cresh.eu',
          name: 'from name',
        },
        to: {
          email: 'receiver@tests.cresh.eu',
          name: 'to name',
        },
        subject: 'test',
        attachments: [
          {
            contentType: 'base64',
            filename: 'logo.png',
            contentId: 'logo',
            base64Content: 'whatever',
          },
        ],
      }

      const client = {
        send: (opts: EmailSendingOptions): Promise<EspResponse> => {
          opts.from?.should.deep.equal(options.from)
          opts.to.should.deep.equal(options.to)
          opts.subject?.should.equal(options.subject)
          opts.attachments?.should.be.an('array').with.lengthOf(1)
          opts.attachments?.forEach(attachment => {
            attachment.should.have.all.keys([
              'contentType',
              'filename',
              'contentId',
              'base64Content',
            ])
          })

          return new Promise(resolve => { resolve({ response: {} }) })
        },
      }
      const spy = sinon.spy(client, 'send')

      await emailHelper.send(options, client)

      spy.should.have.been.calledOnce
    })

    it('should use default options', async () => {
      const defaultOptions = {
        from: {
          email: process.env.EMAIL_SENDER_ADDRESS,
          name: process.env.EMAIL_SENDER_NAME,
        },
      }

      const options = {
        to: {
          email: 'receiver@tests.sdr.eu',
          name: 'to name',
        },
        subject: 'test',
      }

      const client = {
        send: (opts: EmailSendingOptions): Promise<EspResponse> => {
          opts.from?.should.deep.equal(defaultOptions.from)
          opts.to.should.deep.equal(options.to)
          opts.subject?.should.equal(options.subject)
          expect(opts.attachments).to.be.undefined

          return new Promise(resolve => { resolve({ response: {} }) })
        },
      }
      const spy = sinon.spy(client, 'send')

      await emailHelper.send(options, client)

      spy.should.have.been.calledOnce
    })
  })

  describe('sendWelcomeEmail method', () => {
    it('should send the right options to the provider', async () => {
      const defaultOptions = {
        from: {
          email: process.env.EMAIL_SENDER_ADDRESS,
          name: process.env.EMAIL_SENDER_NAME,
        },
        subject: 'Inscription sur Le Sentier des Rêves !',
        htmlPart: tplContent,
      }

      const options = {
        to: {
          email: 'receiver@tests.sdr.fr',
          name: 'to name',
        },
      }

      const client = {
        send: (opts: EmailSendingOptions): Promise<EspResponse> => {
          opts.from?.should.deep.equal(defaultOptions.from)
          opts.to.should.deep.equal(options.to)
          opts.subject?.should.equal(defaultOptions.subject)
          opts.htmlPart?.should.equal(defaultOptions.htmlPart)
          expect(opts.attachments).to.be.undefined

          return new Promise(resolve => { resolve({ response: {} }) })
        },
      }
      const spy = sinon.spy(client, 'send')

      await emailHelper.sendWelcomeEmail(options, client)

      spy.should.have.been.calledOnce
    })
  })
})
