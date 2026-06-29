import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, buyerPersona } = body;

    if (!topic || !buyerPersona) {
      return NextResponse.json({ error: 'Missing topic or persona variables.' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'Your GROQ_API_KEY environment variable is blank or missing. Check your .env.local file!' 
      }, { status: 500 });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
  model: 'llama-3.1-8b-instant', 
  messages: [
    {
      role: 'system',
      content: `You are an elite copywriter. Respond ONLY with a raw, valid JSON object matching this schema exactly:
      {
        "headline": "punchy title",
        "subheading": "value prop text",
        "article": "content offer text",
        "socialPosts": ["post 1", "post 2"]
      }`
    },
    {
      role: 'user',
      content: `Product/Topic: ${topic}. Target Audience/Buyer Persona: ${buyerPersona}.`
    }
  ],
  response_format: { type: 'json_object' },
  temperature: 0.7,
      }),
    });

    const data = await response.json();

    
    if (!response.ok) {
      return NextResponse.json({ 
        error: `Groq Server Rejected Request: ${data.error?.message || response.statusText}` 
      }, { status: response.status });
    }

    const rawAiText = data.choices[0].message.content;
    const parsedCampaign = JSON.parse(rawAiText);

    return NextResponse.json({
      ...parsedCampaign,
      personaText: buyerPersona,
      generatedAt: new Date().toLocaleTimeString()
    });

  } catch (error: any) {
    console.error('Groq API Error:', error);
    return NextResponse.json({ 
      error: `System Crash: ${error.message || 'Unknown processing error'}` 
    }, { status: 500 });
  }
}