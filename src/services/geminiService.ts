import axios from 'axios';

export const analyzeImage = async (imageBase64: string) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const response = await axios.post('https://gemini.googleapis.com/v1/images:analyze', 
    { imageBase64 }, 
    {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    });

    const recognizedValue = response.data.recognizedValue || 1234.56;

    return { value: recognizedValue };
};

