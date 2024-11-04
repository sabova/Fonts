import axios from 'axios';
import { NextResponse } from 'next/server';
import dotenv from 'dotenv';
dotenv.config();

export async function POST(request) {
  const { imageURL, imageBase64, searchEntireImage = 1, freeOnly = 0, limit = 2 } = await request.json();

  const API_KEY = process.env.API_KEY;
  const endpoint = 'https://www.whatfontis.com/api2/';

  const formData = new URLSearchParams();
  formData.append('API_KEY', API_KEY);
  formData.append('NOTTEXTBOXSDETECTION', searchEntireImage);
  formData.append('FREEFONTS', freeOnly);
  formData.append('limit', limit);

  if (imageBase64) {
    formData.append('IMAGEBASE64', 1);
    formData.append('urlimagebase64', imageBase64);
  } else if (imageURL) {
    formData.append('IMAGEBASE64', 0);
    formData.append('urlimage', imageURL);
  } else {
    return NextResponse.json({ error: 'Image URL or image required' }, { status: 400 });
  }

  try {
    const { data } = await axios.post(endpoint, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    const status = error.response?.status || 500;
    let errorMessage = 'An unknown error occurred';

    switch (status) {
      case 420:
        errorMessage = 'Backend API is down, please try again later';
        break;
      case 409:
        errorMessage = 'No API key provided, please contact the administrators';
        break;
      case 429:
        errorMessage = 'API rate limit exceeded, please try again tomorrow';
        break;
      case 422:
        errorMessage = 'Image error or unsupported format';
        break;
      default:
        errorMessage = 'Unexpected server error';                
    }

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
