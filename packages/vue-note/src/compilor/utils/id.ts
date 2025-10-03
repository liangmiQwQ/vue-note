import { createHash } from 'node:crypto'

export function getID(componentIndex: number): string {
  return createHash('md5').update(`${componentIndex}`).digest('hex').slice(0, 8)
}

export function getUniqueID(filename: string, id: string): string {
  return createHash('md5').update(`${filename}_${id}`).digest('hex').slice(0, 8)
}

export function getUniqueFilename(filename: string, id: string): string {
  return `${filename}?component=${id}`
}
