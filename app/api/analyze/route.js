import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { imagePath } = await req.json();
    
    // Convert relative path to absolute URL for OpenAI
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const imageUrl = `${baseUrl}${imagePath}`;

    // Step 1: Analyze skin tones
    const skinToneResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a color analysis expert. When given a face image, analyze the skin tones and return ONLY a JSON object with exactly 5 hex color codes representing the most prominent skin tones found, from lightest to darkest. Format must be: {"skinColors": ["#HEXCODE1", "#HEXCODE2", "#HEXCODE3", "#HEXCODE4", "#HEXCODE5"]}. Do not include any other text or explanation.`
        },
        {
          role: 'user',
          content: JSON.stringify([
            {
              type: 'text',
              text: 'Analyze this face and extract the top 5 skin tone colors.'
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
                detail: 'high'
              }
            }
          ])
        }
      ],
      max_tokens: 150,
      temperature: 0.2
    });

    // Extract skin colors from first response
    const skinToneResult = JSON.parse(skinToneResponse.choices[0].message.content);
    const skinColors = skinToneResult.skinColors;

    // Step 2: Get seasonal color recommendations
    const seasonalResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional color analyst. Based on the provided skin tone colors, determine the most flattering color palettes for each season (Winter, Spring, Summer, Autumn). Return ONLY a JSON object with exactly 6 complementary colors for each season. Format must be:
          {
            "seasonalPalettes": {
              "Winter": ["#HEX1", "#HEX2", "#HEX3", "#HEX4", "#HEX5", "#HEX6"],
              "Spring": ["#HEX1", "#HEX2", "#HEX3", "#HEX4", "#HEX5", "#HEX6"],
              "Summer": ["#HEX1", "#HEX2", "#HEX3", "#HEX4", "#HEX5", "#HEX6"],
              "Autumn": ["#HEX1", "#HEX2", "#HEX3", "#HEX4", "#HEX5", "#HEX6"]
            }
          }`
        },
        {
          role: 'user',
          content: `Based on these skin tone colors: ${JSON.stringify(skinColors)}, provide seasonal color palettes that would be most flattering for this person.`
        }
      ],
      max_tokens: 500,
      temperature: 0.3
    });

    // Parse the seasonal palettes
    const seasonalResult = JSON.parse(seasonalResponse.choices[0].message.content);

    // Return combined results
    return NextResponse.json({
      success: true,
      results: {
        skinColors: skinColors,
        seasonalPalettes: seasonalResult.seasonalPalettes
      }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    
    let errorMessage = 'Failed to analyze image';
    let statusCode = 500;

    if (error.code === 'model_not_found') {
      errorMessage = 'AI model configuration error';
      statusCode = 400;
    } else if (error.code === 'invalid_request_error') {
      errorMessage = 'Invalid request to AI service';
      statusCode = 400;
    } else if (error.code === 'rate_limit_exceeded') {
      errorMessage = 'Too many requests, please try again later';
      statusCode = 429;
    }

    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage
      },
      { status: statusCode }
    );
  }
} 