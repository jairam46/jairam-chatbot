import { readBody, setHeader, getHeader } from 'h3'
import { GoogleGenAI } from '@google/genai'

export default defineEventHandler(async (event) => {
  // CORS handling: echo origin when allowed (safer than always '*')
  const origin = String(getHeader(event, 'origin') || '')
  const allowedFromEnv = process.env.ALLOWED_ORIGINS || ''
  const allowedOrigins = allowedFromEnv
    ? allowedFromEnv.split(',').map((s) => s.trim()).filter(Boolean)
    : [
        'https://jairam-chatbot.vercel.app',
        'https://bookish-barnacle-pj5rjqwpg4g939w75-3000.app.github.dev',
        'http://localhost:3000',
      ]

  const allowOrigin = origin && allowedOrigins.includes(origin) ? origin : '*'

  setHeader(event, 'Access-Control-Allow-Origin', allowOrigin)
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
