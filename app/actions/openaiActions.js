'use server'

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generateWarning({ input }) {
  try {
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: input,
    })

    const buffer = await response.arrayBuffer()
    const base64Audio = Buffer.from(buffer).toString('base64')
    return `data:audio/mp3;base64,${base64Audio}`
  } catch (error) {
    console.error('Error generating warning:', error)
    throw new Error('Failed to generate warning')
  }
}