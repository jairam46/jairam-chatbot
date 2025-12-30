import { setHeader, getHeader } from 'h3'

export default defineEventHandler((event) => {
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

  // Respond to preflight
  return {
    ok: true,
  }
})
