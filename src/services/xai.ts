// src/services/xai.ts
export const generateCode = async (prompt: string, currentCode: string = '') => {
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + import.meta.env.VITE_XAI_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'grok-beta',
      messages: [
        { role: 'system', content: 'You are an expert React + TypeScript + Tailwind developer. Only return code, no explanations.' },
        { role: 'user', content: `${currentCode ? `Current code:\n\`\`\`\n${currentCode}\n\`\`\`\n\n` : ''}Task: ${prompt}` }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
};