'use client';

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const SUGGESTIONS = [
  'Write an agenda for a 30-minute team standup',
  'Draft a friendly meeting invitation message',
  'Give me 3 icebreaker questions for a video call',
  'Summarize tips for running an effective meeting',
];

const AIChatPage = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: trimmed },
    ];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to get a response');
      }

      setMessages([
        ...nextMessages,
        { role: 'assistant', content: data.reply as string },
      ]);
    } catch (error) {
      // Roll back the optimistic user message stays, but surface the error.
      toast({
        title: 'AI Chat error',
        description:
          error instanceof Error ? error.message : 'Something went wrong.',
      });
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content:
            "Sorry, I couldn't respond just now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <section className="flex size-full flex-col gap-6 text-white">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold lg:text-3xl">AI Chat</h1>
        <p className="text-sm text-sky-1">
          Your meeting assistant. Ask anything to get quick help.
        </p>
      </div>

      <div className="flex h-[calc(100vh-260px)] w-full flex-col rounded-2xl border border-dark-3 bg-dark-2 xl:max-w-[900px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5">
          {isEmpty ? (
            <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-blue-1 text-2xl">
                🤖
              </div>
              <div>
                <p className="text-lg font-semibold">
                  How can I help you today?
                </p>
                <p className="mt-1 text-sm text-sky-1">
                  Pick a suggestion or type your own message.
                </p>
              </div>
              <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => sendMessage(s)}
                    className="rounded-xl border border-dark-3 bg-dark-3 p-3 text-left text-sm transition hover:bg-dark-4 hover:brightness-110"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn('flex w-full', {
                    'justify-end': m.role === 'user',
                    'justify-start': m.role === 'assistant',
                  })}
                >
                  <div
                    className={cn(
                      'max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed',
                      {
                        'bg-blue-1 text-white': m.role === 'user',
                        'bg-dark-3 text-white': m.role === 'assistant',
                      },
                    )}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl bg-dark-3 px-4 py-3">
                    <span className="size-2 animate-bounce rounded-full bg-sky-1 [animation-delay:-0.3s]" />
                    <span className="size-2 animate-bounce rounded-full bg-sky-1 [animation-delay:-0.15s]" />
                    <span className="size-2 animate-bounce rounded-full bg-sky-1" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-3 border-t border-dark-3 p-4"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Type your message... (Enter to send, Shift+Enter for a new line)"
            className="max-h-32 flex-1 resize-none rounded-xl border-none bg-dark-3 p-3 text-sm text-white outline-none placeholder:text-sky-1 focus:ring-0"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-xl bg-blue-1 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Sending…' : 'Send'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AIChatPage;
