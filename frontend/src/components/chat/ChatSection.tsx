'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const SUGGESTIONS = [
  'Tell me about Ved',
  'Explain VocaBridge',
  'What ML skills does Ved have?',
  'What is the Exchange Simulator?',
  'Tell me about VocaBridge architecture',
  "What's Ved's educational background?",
];

const VED_CONTEXT = `You are "Ved AI", a concise and knowledgeable assistant embedded in Ved Bajaj's portfolio.

ABOUT VED BAJAJ:
- BTech Computer Science student at COEP Technological University, Pune, India
- Roles: AI/ML Engineer, Full Stack Developer, Quant Finance Enthusiast
- JEE Mains: 99.2 Percentile | MHTCET: 98.6 Percentile
- Location: Pune, Maharashtra, India

SKILLS:
- Languages: C, C++, Python, JavaScript, TypeScript
- Frontend: React, Next.js, Tailwind CSS, Framer Motion, Shadcn UI
- Backend: Node.js, Express.js, REST APIs, WebSockets
- AI/ML: Machine Learning, NLP, RAG, FAISS, Whisper, Ollama, AI Agents
- Databases: MongoDB, PostgreSQL
- Domains: Quantitative Finance, Real-Time Systems, LLM Pipelines

PROJECTS:
1. VocaBridge (Featured) — Multilingual AI Banking Assistant
   - Real-time voice banking assistant with Whisper STT, multilingual NLP, RAG+FAISS retrieval
   - WebSocket streaming architecture, voice synthesis
   - Tech: Python, Whisper, NLP, RAG, FAISS, React, WebSockets

2. Expense Management System — Enterprise Finance Tracker
   - Role-based access, approval workflows, JWT auth
   - Tech: React, Node.js, Express, MongoDB

3. Exchange Simulator — Low-Latency Matching Engine
   - C++ order matching engine, price-time priority, WebSocket market data
   
4. Personality Prediction AI — ML Behavioral Analysis
   - Big Five personality prediction, XGBoost + Random Forest ensemble
   - Tech: Python, Scikit-learn, XGBoost

CLUBS/EXPERIENCE:
- COEP Quantitative Finance Club (Member & Analyst)
- COEP DSAI Club (Core Member)
- Student Alumni Coordination Cell (Coordinator)
- COEP Impressions (Member)

Keep answers concise (2-4 sentences), professional, and strictly about Ved. Redirect unrelated questions politely.`;

export default function ChatSection() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      role: 'assistant',
      content: "Hi! I'm Ved AI 👋 I can answer anything about Ved's background, projects, skills, and experience. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = { id: uuidv4(), role: 'user', content: text, timestamp: new Date() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    const history = [...messages, userMsg]
      .filter((m) => m.role !== 'assistant' || messages.indexOf(m) > 0)
      .slice(-10)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: VED_CONTEXT,
          messages: history,
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text ?? "I'm having trouble connecting. Please try again!";
      setMessages((m) => [...m, { id: uuidv4(), role: 'assistant', content: reply, timestamp: new Date() }]);
    } catch {
      setMessages((m) => [...m, { id: uuidv4(), role: 'assistant', content: 'Connection error. Please try again!', timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="chat" className="py-32" style={{ background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg2) 50%, var(--bg) 100%)' }}>
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="section-tag">05 / AI Assistant</span>
          <h2 className="section-title">Chat with <span className="gradient-text">Ved AI</span></h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-accent to-accent2 mx-auto mt-3 mb-4" />
          <p className="text-text2 text-base">Powered by Claude. Ask anything about Ved's skills, projects, or background.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-surface border border-border rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center font-heading font-bold text-sm text-black">AI</div>
            <div>
              <h4 className="font-heading font-bold text-sm">Ved AI</h4>
              <p className="font-mono text-xs text-brand-green">● Online — Powered by Claude</p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-brand-green animate-pulse" />
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 flex flex-col gap-4" style={{ scrollbarWidth: 'thin' }}>
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col max-w-[82%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
                >
                  <span className="font-mono text-xs text-text3 mb-1">{msg.role === 'user' ? 'You' : 'Ved AI'}</span>
                  <div
                    className={`px-4 py-3 rounded-xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-accent to-accent2 text-black font-medium rounded-br-sm'
                        : 'bg-bg-tertiary border border-border text-text rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="self-start">
                  <span className="font-mono text-xs text-text3 mb-1 block">Ved AI</span>
                  <div className="px-4 py-3 bg-bg-tertiary border border-border rounded-xl rounded-bl-sm flex gap-1.5 items-center">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ scale: [0.7, 1, 0.7], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                        className="w-1.5 h-1.5 rounded-full bg-text3"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          <div className="px-6 pb-3 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {SUGGESTIONS.slice(0, 4).map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                disabled={loading}
                className="font-mono text-xs px-3 py-1.5 border border-border2 rounded-full text-text2 hover:text-accent hover:border-accent transition-all whitespace-nowrap flex-shrink-0 disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t border-border flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder="Ask about Ved's projects, skills, or experience..."
              disabled={loading}
              className="flex-1 bg-bg-tertiary border border-border rounded-xl px-4 py-2.5 text-sm text-text outline-none focus:border-accent transition-colors placeholder:text-text3 disabled:opacity-50"
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-accent to-accent2 rounded-xl flex items-center justify-center text-black font-bold disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              ➤
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
