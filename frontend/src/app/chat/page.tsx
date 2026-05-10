'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageShell from '@/components/ui/PageShell';
import SiteFooter from '@/components/sections/SiteFooter';
import { PERSONAL_DETAILS } from '@/config/personal';
import { chatApi } from '@/services/api';

interface Msg { id: string; role: 'user' | 'assistant'; content: string; ts: Date; }

let msgId = 0;
const uid = () => `m${++msgId}`;

const SUGGESTIONS = [
  'Tell me about Ved',
  'Explain VocaBridge in detail',
  'What ML skills does Ved have?',
  'What is the Exchange Simulator?',
  "What's Ved's educational background?",
  'What clubs is Ved part of?',
];



export default function ChatPage() {
  const [msgs, setMsgs]       = useState<Msg[]>([
    { id: uid(), role: 'assistant', content: "Hi! I'm Ved AI 👋 — your guide to everything about Ved Bajaj. Ask me about his projects, skills, education, or experience!", ts: new Date() },
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showSugg, setShowSugg] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || loading) return;
    setShowSugg(false);
    setInput('');
    setLoading(true);

    const userMsg: Msg = { id: uid(), role: 'user', content: t, ts: new Date() };
    setMsgs(m => [...m, userMsg]);

    const history = [...msgs, userMsg]
      .slice(-12)
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await chatApi.send(history as { role: 'user' | 'assistant', content: string }[]);
      const reply = res.data.data.reply;
      setMsgs(m => [...m, { id: uid(), role: 'assistant', content: reply, ts: new Date() }]);
    } catch {
      setMsgs(m => [...m, { id: uid(), role: 'assistant', content: 'Connection error — please try again.', ts: new Date() }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const fmt = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <PageShell
      tag="05 / AI Assistant"
      title="Chat with"
      accent="Ved AI"
      breadcrumb="AI Chat"
      desc="Ask anything about Ved's projects, skills, background, or experience."
    >
      <div className="max-w-3xl mx-auto">
        {/* Chat window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface border border-border rounded-2xl overflow-hidden flex flex-col"
          style={{ height: '68vh', minHeight: 480 }}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-border flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-heading font-bold text-sm text-black"
              style={{ background: 'linear-gradient(135deg,#00d4ff,#0088ff)' }}>AI</div>
            <div>
              <h4 className="font-heading font-bold text-sm">Ved AI</h4>
              <p className="font-mono text-xs" style={{ color: 'var(--green)' }}>● Online</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="font-mono text-xs text-text3">{msgs.length - 1} messages</span>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--green)' }} />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4" style={{ scrollbarWidth: 'thin' }}>
            <AnimatePresence initial={false}>
              {msgs.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end self-end' : 'items-start self-start'} max-w-[82%]`}
                >
                  <span className="font-mono text-xs text-text3 mb-1 px-1">
                    {msg.role === 'user' ? 'You' : 'Ved AI'} · {fmt(msg.ts)}
                  </span>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'text-black font-medium rounded-br-sm'
                        : 'text-text border border-border rounded-bl-sm'
                    }`}
                    style={msg.role === 'user'
                      ? { background: 'linear-gradient(135deg,#00d4ff,#0088ff)' }
                      : { background: 'var(--bg3)' }}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="self-start flex flex-col items-start max-w-xs"
                >
                  <span className="font-mono text-xs text-text3 mb-1 px-1">Ved AI</span>
                  <div className="px-4 py-3 border border-border rounded-2xl rounded-bl-sm flex gap-1.5 items-center"
                    style={{ background: 'var(--bg3)' }}>
                    {[0, 1, 2].map(i => (
                      <motion.span key={i}
                        animate={{ scale: [0.7, 1, 0.7], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.2 }}
                        className="block w-1.5 h-1.5 rounded-full"
                        style={{ background: 'var(--text3)' }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={endRef} />
          </div>

          {/* Suggestions */}
          <AnimatePresence>
            {showSugg && (
              <motion.div
                initial={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 pb-3 flex gap-2 overflow-x-auto flex-shrink-0"
                style={{ scrollbarWidth: 'none' }}
              >
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)}
                    className="font-mono text-xs px-3 py-1.5 border border-border2 rounded-full text-text2 hover:text-accent hover:border-accent transition-all whitespace-nowrap flex-shrink-0">
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input bar */}
          <div className="px-5 py-4 border-t border-border flex gap-3 flex-shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
              disabled={loading}
              placeholder="Ask about Ved's projects, skills, or experience..."
              className="flex-1 rounded-xl px-4 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-text3 disabled:opacity-50"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', outline: 'none' }}
              onFocus={e => (e.target.style.borderColor = '#00d4ff')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl text-black font-bold disabled:opacity-40 transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#00d4ff,#0088ff)' }}
            >
              ➤
            </button>
          </div>
        </motion.div>

        {/* Suggestions below chat */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 grid sm:grid-cols-2 gap-3"
        >
          {SUGGESTIONS.slice(0, 4).map(s => (
            <button key={s} onClick={() => send(s)}
              className="text-left p-4 bg-surface border border-border rounded-xl hover:border-accent/30 transition-all group">
              <div className="font-mono text-xs text-accent mb-1 group-hover:text-accent">◇</div>
              <div className="font-mono text-xs text-text2 group-hover:text-text transition-colors">{s}</div>
            </button>
          ))}
        </motion.div>
      </div>
    </PageShell>
  );
}
