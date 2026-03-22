const defaultSuggestions = [
  'Help me write a pin title.',
  'Suggest categories for my content.',
  'How can I make my profile look better?',
  'Give me ideas for my next post.',
];

const buildSystemPrompt = () =>
  [
    'You are Glimpse AI, a concise assistant inside a Pinterest-style app.',
    'Help users with content ideas, pin descriptions, profile polish, categories, and visual inspiration.',
    'Keep answers practical, friendly, and short.',
    'If asked something outside the app, still be helpful but concise.',
  ].join(' ');

const cleanMessage = (message) => message.toLowerCase().replace(/\s+/g, ' ').trim();

const extractTopic = (message) => {
  const withoutQuestion = message.replace(/\?+$/g, '').trim();
  const parts = withoutQuestion.split(' ');

  if (parts.length <= 3) {
    return withoutQuestion;
  }

  return parts.slice(-3).join(' ');
};

const buildFallbackReply = (message) => {
  const text = cleanMessage(message);

  if (text.includes('your name') || text.includes('who are you') || text === 'name') {
    return 'I am Glimpse AI, your built-in assistant for pin ideas, titles, categories, and profile polish.';
  }

  if (text === 'hi' || text === 'hello' || text === 'hey' || text.startsWith('hi ') || text.startsWith('hello ')) {
    return 'Hi! I can help with pin titles, descriptions, categories, profile polish, and post ideas. What do you want to improve?';
  }

  if (text.includes('how are you')) {
    return 'I am doing well and ready to help you build better pins. Ask me for a title, description, category, or profile idea.';
  }

  if (text.includes('title')) {
    const topic = extractTopic(message);
    return `Try a short, punchy title with a clear mood. For "${topic}", you could use "Moody ${topic} Ideas", "Clean ${topic} Inspiration", or "Bold ${topic} Concepts".`;
  }

  if (text.includes('description') || text.includes('about')) {
    return 'Write 1-2 lines that explain the mood, purpose, or visual style. A good format is: what it is, why it stands out, and where it can be used.';
  }

  if (text.includes('category')) {
    return 'Good Glimpse categories for most posts are photo, art, websites, wallpaper, travel, and others. Pick the one that best matches the main visual.';
  }

  if (text.includes('profile')) {
    return 'Use a clear profile photo, keep your name simple, and publish 4-6 strong pins with a consistent style so your profile feels complete.';
  }

  if (text.includes('idea') || text.includes('post') || text.includes('pin')) {
    return 'Try one of these: a moodboard post, a clean wallpaper pin, a website inspiration card, a travel visual diary, or a before/after design concept.';
  }

  if (text.includes('search')) {
    return 'Search works best with short phrases like "portrait", "dark wallpaper", "travel moodboard", or "landing page". Keep it visual and specific.';
  }

  if (text.includes('upload') || text.includes('image')) {
    return 'Use one strong image with a clear focal point. Portrait images and high-contrast visuals usually look best in the feed.';
  }

  if (text.includes('comment')) {
    return 'A good comment is short and specific. Mention what stood out, like color, mood, composition, or usefulness.';
  }

  return 'I can help with pin titles, descriptions, categories, profile polish, and post ideas. Try asking "suggest a title for my post", "which category fits this pin", or "how should I improve my profile?"';
};

const getAiConfig = () => {
  if (process.env.GEMINI_API_KEY) {
    return {
      provider: 'gemini',
      apiKey: process.env.GEMINI_API_KEY,
      baseUrl: process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta',
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    };
  }

  if (process.env.OPENAI_API_KEY) {
    return {
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
      baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    };
  }

  return null;
};

const requestAiReply = async (message) => {
  const config = getAiConfig();

  if (!config?.apiKey) {
    return null;
  }

  let response;

  if (config.provider === 'gemini') {
    response = await fetch(`${config.baseUrl}/models/${config.model}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': config.apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: buildSystemPrompt() }],
        },
        generationConfig: {
          temperature: 0.7,
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: message }],
          },
        ],
      }),
    });
  } else {
    response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.7,
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          { role: 'user', content: message },
        ],
      }),
    });
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${config.provider} request failed: ${errorText}`);
  }

  const data = await response.json();

  if (config.provider === 'gemini') {
    return data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim() || null;
  }

  return data.choices?.[0]?.message?.content?.trim() || null;
};

export const sendChatMessage = async (req, res) => {
  const { message } = req.body;

  if (!message?.trim()) {
    res.status(400).json({ message: 'Message is required' });
    return;
  }

  try {
    const aiReply = await requestAiReply(message.trim());

    res.json({
      reply: aiReply || buildFallbackReply(message.trim()),
      mode: aiReply ? 'ai' : 'fallback',
      suggestions: defaultSuggestions,
    });
  } catch (error) {
    console.error('Chat assistant error', error);
    res.json({
      reply: buildFallbackReply(message.trim()),
      mode: 'fallback',
      suggestions: defaultSuggestions,
    });
  }
};
