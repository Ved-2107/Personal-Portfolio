'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { skillsApi, experienceApi, contactApi } from '@/services/api';
import toast from 'react-hot-toast';
import { SOCIAL_LINKS, PERSONAL_DETAILS } from '@/config/personal';

// ─── ABOUT ───────────────────────────────────────────────────
export function About() {
  const achievements = [
    { icon: '🎯', label: 'JEE Mains 2023', value: '99.2 Percentile' },
    { icon: '⚡', label: 'MHTCET 2023', value: '98.6 Percentile' },
    { icon: '🏛️', label: 'University', value: 'COEP Technological University' },
    { icon: '📍', label: 'Location', value: PERSONAL_DETAILS.location },
  ];
  const timeline = [
    { date: '2023 — Present', title: 'BTech CS @ COEP', desc: 'Studying Computer Science with focus on AI/ML, systems programming, and software engineering.', color: 'var(--accent)' },
    { date: '2024', title: 'VocaBridge — AI Banking Assistant', desc: 'Built a production-grade multilingual AI banking assistant with real-time voice pipeline using Whisper + RAG + FAISS.', color: 'var(--purple)' },
    { date: '2024', title: 'Exchange Simulator in C++', desc: 'Designed a real-time order matching engine with price-time priority and WebSocket streaming.', color: 'var(--accent3)' },
    { date: '2023', title: 'Joined COEP Quant Finance Club', desc: 'Exploring algorithmic trading, ML-driven strategies, and financial systems.', color: 'var(--green)' },
  ];

  return (
    <section id="about" className="py-32" style={{ background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg2) 50%, var(--bg) 100%)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="section-tag">01 / About</span>
          <h2 className="section-title">The <span className="gradient-text">Engineer</span> Behind the Code</h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-accent to-accent2 mx-auto mt-3" />
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3 className="font-heading font-bold text-xl mb-4">Who I Am</h3>
            <p className="text-text2 leading-relaxed mb-4">I'm a Computer Science student at COEP Technological University — one of India's premier engineering institutions. My work sits at the intersection of AI/ML, real-time systems, and quantitative finance.</p>
            <p className="text-text2 leading-relaxed mb-8">From building multilingual AI banking assistants with voice-to-voice pipelines to designing low-latency exchange matching engines in C++, I thrive on tackling complex, high-impact problems with elegant engineering solutions.</p>
            <div className="grid grid-cols-1 gap-3">
              {achievements.map((a) => (
                <motion.div key={a.label} whileHover={{ x: 4 }} className="flex items-center gap-4 p-4 bg-surface border border-border rounded-xl hover:border-accent/30 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-lg flex-shrink-0">{a.icon}</div>
                  <div>
                    <div className="font-mono text-xs text-text3 uppercase tracking-wider">{a.label}</div>
                    <div className="font-heading font-bold text-sm gradient-text">{a.value}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3 className="font-heading font-bold text-lg mb-6">Timeline</h3>
            <div className="relative pl-6">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-border to-transparent" />
              {timeline.map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="relative pb-8 pl-6">
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full" style={{ background: t.color, boxShadow: `0 0 10px ${t.color}` }} />
                  <div className="font-mono text-xs mb-1" style={{ color: t.color }}>{t.date}</div>
                  <div className="font-heading font-semibold text-sm mb-1">{t.title}</div>
                  <div className="text-text2 text-sm leading-relaxed">{t.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── SKILLS ──────────────────────────────────────────────────
const FALLBACK_SKILLS = [
  { _id: '1', category: 'Languages', icon: '{ }', color: 'rgba(0,212,255,0.1)', items: ['C', 'C++', 'Python', 'JavaScript', 'TypeScript'], order: 1 },
  { _id: '2', category: 'Frontend', icon: '⬡', color: 'rgba(0,136,255,0.1)', items: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Shadcn UI'], order: 2 },
  { _id: '3', category: 'Backend', icon: '⚙', color: 'rgba(157,78,255,0.1)', items: ['Node.js', 'Express.js', 'REST APIs', 'WebSockets'], order: 3 },
  { _id: '4', category: 'AI / ML', icon: '◈', color: 'rgba(0,255,157,0.1)', items: ['Machine Learning', 'NLP', 'RAG', 'FAISS', 'Whisper', 'Ollama', 'AI Agents'], order: 4 },
  { _id: '5', category: 'Databases', icon: '⊞', color: 'rgba(255,107,53,0.1)', items: ['MongoDB', 'PostgreSQL'], order: 5 },
  { _id: '6', category: 'Domains', icon: '◎', color: 'rgba(255,200,0,0.1)', items: ['Quantitative Finance', 'Real-Time Systems', 'LLM Pipelines', 'System Design'], order: 6 },
];

export function Skills() {
  const [skills, setSkills] = useState(FALLBACK_SKILLS);
  useEffect(() => { skillsApi.getAll().then((r) => { if (r.data.data?.length) setSkills(r.data.data); }).catch(() => {}); }, []);

  return (
    <section id="skills" className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="section-tag">02 / Skills</span>
          <h2 className="section-title">Tech <span className="gradient-text">Arsenal</span></h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-accent to-accent2 mx-auto mt-3 mb-4" />
          <p className="text-text2 max-w-lg mx-auto">A curated toolkit spanning AI/ML, systems programming, and modern full-stack development.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((s, i) => (
            <motion.div key={s._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}
              whileHover={{ y: -4, boxShadow: '0 0 30px rgba(0,212,255,0.08)' }}
              className="bg-surface border border-border rounded-2xl p-6 transition-all duration-300 hover:border-accent/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base font-mono" style={{ background: s.color }}>{s.icon}</div>
                <span className="font-heading font-bold text-sm">{s.category}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {s.items.map((item) => (
                  <motion.span key={item} whileHover={{ scale: 1.05 }}
                    className="font-mono text-xs px-2.5 py-1 rounded-md border border-border2 text-text2 hover:border-accent hover:text-accent transition-all cursor-default">
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── EXPERIENCE ──────────────────────────────────────────────
const FALLBACK_EXP = [
  { _id: '1', period: '2023 — Present', role: 'Member & Analyst', organization: 'COEP Quantitative Finance Club', description: 'Exploring quantitative trading strategies, algorithmic finance, and ML applications in financial markets.', type: 'club', order: 1 },
  { _id: '2', period: '2023 — Present', role: 'Core Member', organization: 'COEP DSAI Club', description: 'Active member of the Data Science & AI club. Conducting workshops and collaborating on AI/ML projects.', type: 'club', order: 2 },
  { _id: '3', period: '2024', role: 'Coordinator', organization: 'Student Alumni Coordination Cell', description: 'Bridging the gap between alumni network and current students. Organizing mentorship programs and placement prep.', type: 'club', order: 3 },
  { _id: '4', period: '2023 — Present', role: 'Member', organization: 'COEP Impressions (Annual Fest)', description: "Part of the organizing committee for COEP's annual cultural and technical festival.", type: 'club', order: 4 },
];

export function Experience() {
  const [exp, setExp] = useState(FALLBACK_EXP);
  useEffect(() => { experienceApi.getAll().then((r) => { if (r.data.data?.length) setExp(r.data.data); }).catch(() => {}); }, []);

  return (
    <section id="experience" className="py-32" style={{ background: 'linear-gradient(180deg, var(--bg2) 0%, var(--bg) 100%)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="section-tag">04 / Experience</span>
          <h2 className="section-title">Clubs & <span className="gradient-text">Involvement</span></h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-accent to-accent2 mx-auto mt-3" />
        </motion.div>
        <div className="grid sm:grid-cols-2 gap-5">
          {exp.map((e, i) => (
            <motion.div key={e._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              whileHover={{ y: -3 }} className="bg-surface border border-border rounded-2xl p-7 transition-all duration-300 hover:border-accent/30 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="font-mono text-xs text-accent mb-2">{e.period}</div>
              <h3 className="font-heading font-bold text-base mb-1">{e.role}</h3>
              <div className="text-accent2 text-sm font-mono mb-3">{e.organization}</div>
              <p className="text-text2 text-sm leading-relaxed">{e.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────
export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error('Please fill all required fields.'); return; }
    setLoading(true);
    try {
      await contactApi.send(form);
      setSent(true);
      toast.success('Message sent! I\'ll get back to you soon.');
    } catch {
      toast.error('Failed to send. Please try again.');
    } finally { setLoading(false); }
  };

  const socials = [
    { icon: 'GH', label: SOCIAL_LINKS.github.label, url: SOCIAL_LINKS.github.url, sub: SOCIAL_LINKS.github.username, bg: 'rgba(255,255,255,0.05)' },
    { icon: 'in', label: SOCIAL_LINKS.linkedin.label, url: SOCIAL_LINKS.linkedin.url, sub: SOCIAL_LINKS.linkedin.username, bg: 'rgba(0,119,181,0.1)' },
    { icon: '@', label: 'Email', url: `mailto:${PERSONAL_DETAILS.email}`, sub: PERSONAL_DETAILS.email, bg: 'rgba(0,212,255,0.08)' },
  ];

  return (
    <section id="contact" className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="section-tag">06 / Contact</span>
          <h2 className="section-title">Let's <span className="gradient-text">Connect</span></h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-accent to-accent2 mx-auto mt-3" />
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3 className="font-heading font-extrabold text-2xl mb-4">Open to Opportunities</h3>
            <p className="text-text2 leading-relaxed mb-8">Whether you're looking for an AI/ML engineer, full-stack developer, or want to collaborate on something exciting — I'd love to hear from you.</p>
            <div className="flex flex-col gap-3">
              {socials.map((s) => (
                <motion.a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" whileHover={{ x: 4 }}
                  className="flex items-center gap-4 p-4 bg-surface border border-border rounded-xl hover:border-accent/30 transition-all no-underline text-text">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-sm flex-shrink-0 text-accent" style={{ background: s.bg }}>{s.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{s.label}</div>
                    <div className="font-mono text-xs text-text3">{s.sub}</div>
                  </div>
                  <span className="text-text3 text-sm">↗</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            {sent ? (
              <div className="bg-surface border border-brand-green/30 rounded-2xl p-12 text-center">
                <div className="text-4xl mb-4">✓</div>
                <div className="font-heading font-bold text-xl text-brand-green mb-2">Message Sent!</div>
                <div className="text-text2 text-sm">Thanks {form.name}! I'll get back to you soon at {form.email}.</div>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="mt-6 font-mono text-xs text-text3 hover:text-accent transition-colors">Send another →</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-2xl p-8 flex flex-col gap-5">
                {[
                  { id: 'name', label: 'Your Name', type: 'text', placeholder: 'Jane Doe', required: true },
                  { id: 'email', label: 'Email Address', type: 'email', placeholder: 'jane@company.com', required: true },
                  { id: 'subject', label: 'Subject', type: 'text', placeholder: "Let's collaborate!", required: false },
                ].map((f) => (
                  <div key={f.id}>
                    <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-2">{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} required={f.required} value={form[f.id as keyof typeof form]}
                      onChange={(e) => setForm((p) => ({ ...p, [f.id]: e.target.value }))}
                      className="w-full bg-bg-tertiary border border-border rounded-xl px-4 py-3 text-text text-sm outline-none focus:border-accent transition-colors placeholder:text-text3" />
                  </div>
                ))}
                <div>
                  <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-2">Message</label>
                  <textarea placeholder="Tell me about your project or opportunity..." rows={5} required value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    className="w-full bg-bg-tertiary border border-border rounded-xl px-4 py-3 text-text text-sm outline-none focus:border-accent transition-colors placeholder:text-text3 resize-none" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? <><span className="animate-spin">⟳</span> Sending...</> : 'Send Message ↗'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────
export function Footer() {
  return (
    <footer className="py-10 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="font-mono text-xs text-text3">
          Designed & Built by <span className="gradient-text font-bold">{PERSONAL_DETAILS.fullName}</span> — COEP Technological University, Pune · 2025
        </div>
        <div className="font-mono text-xs text-text3">
          AI/ML Engineer · Full Stack Developer · Quant Finance Enthusiast
        </div>
      </div>
    </footer>
  );
}
