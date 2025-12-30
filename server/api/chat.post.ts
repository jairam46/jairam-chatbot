import { readBody, setHeader } from 'h3'
import { GoogleGenAI } from '@google/genai'

export default defineEventHandler(async (event) => {
  // CORS headers (must be first)
  setHeader(event, 'Access-Control-Allow-Origin', '*')
  setHeader(event, 'Access-Control-Allow-Methods', 'POST, OPTIONS')
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Handle preflight
  if (event.method === 'OPTIONS') {
    return { ok: true }
  }

  if (event.method !== 'POST') {
    return { error: 'Method not allowed' }
  }

  const body = await readBody<{ message?: string }>(event)
  const message = body?.message?.trim()

  if (!message) {
    return { error: 'Missing message in request body' }
  }

  const config = useRuntimeConfig()
  const key = process.env.GOOGLE_API_KEY || config.googleApiKey

  if (!key) {
    return { error: 'Missing GOOGLE_API_KEY' }
  }

  const client = new GoogleGenAI({ apiKey: key })

  const response = await client.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: message,
  })

  const reply =
    response?.candidates?.[0]?.content?.parts?.[0]?.text ??
    response?.text ??
    'No response'

  return { reply }
})
