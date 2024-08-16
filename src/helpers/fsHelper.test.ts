import mock from 'mock-fs'

import fsHelper from './fsHelper'
import {
  FileNotFoundError,
} from '../errors'

const basePath = 'relative/path'

const contentImg = 'data:image/png;base64,content'
const contentHtml = '<content>$C)C(C/</content>'

describe('[UNIT] fsHelper', () => {
  beforeEach(() => {
    mock({
      [basePath]: {
        'img.png': contentImg,
        'file.html': contentHtml,
      },
    })
  })

  afterEach(() => {
    mock.restore()
  })

  describe('readFile method', () => {
    it('should get an existing file', async () => {
      const content = await fsHelper.readFile('file.html', basePath, 'utf-8')
      const decodedContent = Buffer.from(content, 'utf-8').toString('ascii')
      content.should.equal(decodedContent)
    })

    it('should raise if a file is not found', async () => {
      let catched
      try {
        await fsHelper.readFile('null.txt', basePath, 'utf-8')
      } catch (error) {
        catched = error
      }
      catched.should.be.instanceOf(FileNotFoundError)
    })
  })

  describe('readFileToBase64 method', () => {
    it('should get an existing file in base64', async () => {
      const content = await fsHelper.readFileToBase64('img.png', basePath)
      const decodedContent = Buffer.from(content, 'base64')
      decodedContent.toString().should.equal(contentImg)
    })
  })

  describe('readFileToUtf8 method', () => {
    it('should get an existing file in utf-8', async () => {
      const content = await fsHelper.readFileToUtf8('file.html', basePath)
      const decodedContent = Buffer.from(content, 'utf-8').toString('ascii')
      content.should.equal(decodedContent)
    })
  })
})
