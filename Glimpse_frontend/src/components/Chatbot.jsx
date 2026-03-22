import { useEffect, useRef, useState } from 'react';
import { FiMessageCircle, FiSend, FiX } from 'react-icons/fi';

import { api } from '../api/client';

const starterSuggestions = [
  'Help me write a pin title.',
  'Suggest categories for my content.',
  'How can I make my profile look better?',
];

const initialMessages = [
  {
    role: 'assistant',
    content: 'Hi, I am Glimpse AI. I can help with pin titles, categories, profile polish, and post ideas.',
  },
];

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const element = messagesRef.current;

    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [messages, loading, open]);

  const sendMessage = async (messageText) => {
    const text = messageText.trim();

    if (!text || loading) {
      return;
    }

    setMessages((current) => [...current, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    setShowSuggestions(false);

    try {
      const response = await api.post('/chat', { message: text });
      setMessages((current) => [...current, { role: 'assistant', content: response.reply }]);
      setSuggestions(response.suggestions || []);
    } catch (error) {
      console.error('Chat request failed', error);
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: 'I could not reach the assistant right now, but I can still help once the backend is running.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#111827] text-white shadow-2xl transition hover:scale-105"
      >
        {open ? <FiX className="text-2xl" /> : <FiMessageCircle className="text-2xl" />}
      </button>

      {open && (
        <div className="glass-panel fixed bottom-24 right-4 z-40 flex h-[68vh] w-[min(360px,calc(100vw-1.25rem))] flex-col overflow-hidden rounded-[28px] p-3 shadow-2xl md:w-[380px]">
          <div className="border-b border-slate-200 px-1 pb-3">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Assistant</p>
            <div className="mt-1 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 md:text-xl">Glimpse AI</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-500">
                Creator helper
              </span>
            </div>
          </div>

          <div ref={messagesRef} className="hide-scrollbar mt-3 flex-1 space-y-3 overflow-y-auto pr-1">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[88%] rounded-[22px] px-4 py-3 text-sm leading-6 ${
                  message.role === 'assistant'
                    ? 'bg-white text-slate-700 shadow-sm ring-1 ring-black/5'
                    : 'ml-auto bg-[#111827] text-white'
                }`}
              >
                {message.content}
              </div>
            ))}

            {loading ? (
              <div className="max-w-[88%] rounded-[22px] bg-white px-4 py-3 text-sm text-slate-500 shadow-sm ring-1 ring-black/5">
                Thinking...
              </div>
            ) : null}
          </div>

          {showSuggestions ? (
          <div className="mt-3">
            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Start with
            </p>
            <div className="flex flex-wrap gap-2">
              {starterSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendMessage(suggestion)}
                    className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-600 ring-1 ring-black/5 transition hover:bg-slate-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSuggestions(true)}
                className="rounded-full bg-white px-3 py-2 text-[11px] font-semibold text-slate-500 ring-1 ring-black/5 transition hover:bg-slate-50"
              >
                Show suggestions
              </button>
            </div>
          ) : null}

          <div className="mt-3 flex items-center gap-2 rounded-[22px] bg-white px-3 py-3 shadow-sm ring-1 ring-black/5">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onFocus={() => {
                if (messages.length > 1) {
                  setShowSuggestions(false);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  sendMessage(input);
                }
              }}
              placeholder="Ask for ideas or profile tips..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff315c] text-white shadow-md transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiSend />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
