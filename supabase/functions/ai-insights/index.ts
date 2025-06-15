
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, blogTitle, blogContent, conversationHistory } = await req.json()
    
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured')
      throw new Error('GEMINI_API_KEY is not configured')
    }

    // Prepare the conversation context
    const context = `
You are an AI assistant helping users understand a blog post titled: "${blogTitle}"

Blog Content:
${blogContent}

Instructions:
- Answer questions about the blog content
- Provide explanations and clarifications
- Give practical examples when helpful
- Be concise but informative
- If asked about something not in the blog, politely redirect to the blog topic
- Use a friendly, educational tone
`

    // Build conversation history for context
    let conversationText = context + "\n\nConversation:\n"
    
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach((msg: any) => {
        conversationText += `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`
      })
    }
    
    conversationText += `User: ${message}\nAssistant:`

    console.log('Making request to Gemini API with key:', GEMINI_API_KEY ? 'Present' : 'Missing')

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: conversationText
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
      }
    )

    console.log('Gemini API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API error:', errorText)
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Gemini API response:', data)
    
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response. Please try again."

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in ai-insights function:', error)
    return new Response(
      JSON.stringify({ error: `Failed to process request: ${error.message}` }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
