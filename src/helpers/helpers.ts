import crypto from 'crypto'

const generateToken = (): string => crypto
  .randomBytes(20).toString('hex')

const slugify = (title: string): string => title
  .toLowerCase() // Convert to lowercase
  .normalize('NFD') // Normalize to decomposed form (NFD)
  .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (accents)
  .trim() // Trim leading and trailing whitespace
  .replace(/[\s\W-]+/g, '-') // Replace spaces, non-word characters, and dashes with a single hyphen
  .replace(/^-+|-+$/g, '') // Remove leading or trailing hyphens

export {
  generateToken,
  slugify,
}
