import { getStore } from '@netlify/blobs'
import type { Config } from '@netlify/functions'

// Single JSON document holding every user change (added books, edits, deletes).
// Reads are public; writes need the passcode set in the BOOKS_PASSCODE env var.
export default async (req: Request) => {
  const store = getStore('books')

  if (req.method === 'GET') {
    const doc = await store.get('data', { type: 'json' })
    return Response.json(doc ?? null, { headers: { 'cache-control': 'no-store' } })
  }

  if (req.method === 'PUT') {
    const passcode = Netlify.env.get('BOOKS_PASSCODE')
    if (!passcode || req.headers.get('x-passcode') !== passcode) {
      return new Response('Unauthorized', { status: 401 })
    }
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return new Response('Bad JSON', { status: 400 })
    }
    const doc = body as { added?: unknown; overrides?: unknown; deleted?: unknown }
    if (!Array.isArray(doc?.added) || !Array.isArray(doc?.deleted) || typeof doc?.overrides !== 'object') {
      return new Response('Bad shape', { status: 400 })
    }
    await store.setJSON('data', { added: doc.added, overrides: doc.overrides, deleted: doc.deleted })
    return new Response(null, { status: 204 })
  }

  return new Response('Method not allowed', { status: 405 })
}

export const config: Config = { path: '/api/books' }
