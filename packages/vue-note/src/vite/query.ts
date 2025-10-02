export interface VueNoteQuery {
  raw?: boolean
}

export function parseQuery(id: string): {
  filename: string
  query: VueNoteQuery
} {
  const [filename, rawQuery] = id.split(`?`, 2)
  const query = Object.fromEntries(new URLSearchParams(rawQuery)) as VueNoteQuery

  if (query.raw != null) {
    query.raw = true
  }

  return {
    filename,
    query,
  }
}
