import type { Node } from 'oxc-parser'

export function getID(node: Node): string {
  return `${node.start}-${node.end}`
}

export function getUniqueID(filename: string, id: string): string {
  return `${filename}_${id}`
}

export function getUniqueFilename(filename: string, id: string): string {
  return `${filename}?component=${id}`
}
