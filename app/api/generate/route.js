import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
// Note: You'll need to set OPENAI_API_KEY in your environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { persona, traits } = await request.json();
    
    if (!persona || !traits) {
      return NextResponse.json(
        { error: 'Persona and traits are required' },
        { status: 400 }
      );
    }

    // Generate name and description
    const nameDescResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are a creative AI that generates unique NFT names and descriptions based on persona traits."
        },
        {
          role: "user",
          content: `Generate a unique, futuristic name and a brief description (max 100 words) for an NFT based on the following persona and traits. Format your response as JSON with 'name' and 'description' fields.\n\nPersona: ${persona}\nTraits: ${traits}`
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the generated name and description
    const nameDescData = JSON.parse(nameDescResponse.choices[0].message.content);

    // Generate image
    const imageResponse = await openai.images.generate({
      model: "dall-e-2",
      prompt: `Create a futuristic, abstract portrait representing an AI persona with these traits: ${traits}. The image should be suitable as an NFT avatar, with a modern, digital aesthetic that represents the persona named "${nameDescData.name}". Use vibrant colors and a clean, professional style.`,
      n: 1,
      size: "1024x1024",
    });

    // Return the generated content
    return NextResponse.json({
      name: nameDescData.name,
      description: nameDescData.description,
      imageUrl: imageResponse.data[0].url
    });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
