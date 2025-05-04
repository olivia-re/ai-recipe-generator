import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { ingredients } = await req.json();

    if (!ingredients) {
      return NextResponse.json(
        { error: 'Ingredients are required' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful chef that creates recipes based on available ingredients. Create TWO different recipes using the same ingredients. Make them distinctly different in style or cuisine. Provide recipes in a clear format with sections for ingredients (with measurements) and instructions. Keep recipes practical and easy to follow. Label them as 'Recipe Option 1:' and 'Recipe Option 2:'."
        },
        {
          role: "user",
          content: `Create two different recipes using these ingredients: ${ingredients}. You can suggest additional basic ingredients (salt, pepper, oil, etc.) if needed. Make the recipes different in style or cuisine type.`
        }
      ],
      temperature: 0.8,
      max_tokens: 1500,
    });

    const recipes = completion.choices[0].message.content;

    return NextResponse.json({ recipes });
  } catch (error) {
    console.error('Error generating recipes:', error);
    return NextResponse.json(
      { error: 'Failed to generate recipes' },
      { status: 500 }
    );
  }
} 