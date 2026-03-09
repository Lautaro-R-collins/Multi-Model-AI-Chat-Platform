import type { Message } from '../types/chat';

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const sendMessageToAI = async (messages: Message[], model: string = 'llama-3.3-70b-versatile') => {
  if (!API_KEY) {
    throw new Error('Groq API Key is missing. Please add VITE_GROQ_API_KEY to your .env file.');
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: messages.map(({ role, content }) => ({ role, content })),
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to fetch response from Groq');
  }

  const data = await response.json();
  return data.choices[0].message.content;
};
