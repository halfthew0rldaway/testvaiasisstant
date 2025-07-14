// For testing purposes only.
// Paste your key in the line below.

const API_KEY = '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';
const API_URL = 'https://api.openai.com/v1/chat/completions';

export async function getAIResponse(prompt) {
  // A simple check to make sure you've added the key.
  if (API_KEY === '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') {
    const message = "API Key not found. Please add your key to the js/openai.js file.";
    alert(message);
    return message;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Good for testing, fast and cheap
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error fetching AI response:', error);
    return 'Sorry, I am having trouble connecting to the AI. Please try again later.';
  }
}