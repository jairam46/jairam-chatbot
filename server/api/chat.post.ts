import { readBody } from 'h3'
import { GoogleGenAI } from '@google/genai'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const message = body?.message?.toString()
  if (!message) return { error: 'Missing message in request body' }

  const config = useRuntimeConfig()
  const key = process.env.GOOGLE_API_KEY || config.googleApiKey || ''
  if (!key) return { error: 'Missing GOOGLE_API_KEY. Add it to .env or runtime config.' }

  try {
    const client = new GoogleGenAI({ apiKey: key })

    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      temperature: 0.2,
      maxOutputTokens: 512
    })

    // Normalize a few common response shapes
    const reply = response?.candidates?.[0]?.content || response?.text || JSON.stringify(response)
    return { reply: reply?.parts?.[0]?.text }
  } catch (err: any) {
    // If the model isn't found, try listing available models to help debugging
    const errMsg = String(err?.message || err)
    try {
      const client = new GoogleGenAI({ apiKey: key })
      const listRes = await client.models.list()
      const names = (listRes?.models || listRes?.modelInfos || []).map((m: any) => m.name || m.model || m.id).filter(Boolean)
      return { error: errMsg, availableModels: names }
    } catch (listErr) {
      return { error: errMsg }
    }
  }
})