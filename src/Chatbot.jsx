import { useState, useRef, useEffect } from "react";

// The chatbot talks to a Netlify Function (netlify/functions/chat.mjs), which
// holds the Anthropic key server-side, uses Claude Haiku, and persists each
// transaction to Netlify Blobs. The browser never sees the API key.
const CHAT_ENDPOINT = "/.netlify/functions/chat";

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const makeId = () =>
  (globalThis.crypto?.randomUUID?.() ||
    `s-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

// Illustrated female receptionist avatar ("Ava") in the MedXFlow palette.
// Inline SVG so it needs no asset and stays crisp at any size; swap for a photo
// by dropping an <img> in its place.
function AvaAvatar({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 120 120" role="img" aria-label="Ava, MedXFlow Front Desk assistant">
      <defs>
        <linearGradient id="aoBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2E7BD6" />
          <stop offset="1" stopColor="#123F7E" />
        </linearGradient>
        <linearGradient id="aoTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#17C3B2" />
          <stop offset="1" stopColor="#0FA093" />
        </linearGradient>
        <clipPath id="aoClip"><circle cx="60" cy="60" r="60" /></clipPath>
      </defs>
      <g clipPath="url(#aoClip)">
        <rect width="120" height="120" fill="url(#aoBg)" />
        {/* shoulders / uniform */}
        <path d="M16 120 Q18 90 42 83 L78 83 Q102 90 104 120 Z" fill="url(#aoTop)" />
        <path d="M60 83 L53 95 L60 102 L67 95 Z" fill="#0FA093" />
        {/* neck */}
        <path d="M51 76 h18 v11 q-9 7 -18 0 Z" fill="#E7B48C" />
        {/* hair (back) */}
        <path d="M29 60 Q29 25 60 25 Q91 25 91 60 Q91 90 78 96 L78 70 Q70 64 60 64 Q50 64 42 70 L42 96 Q29 90 29 60 Z" fill="#4A3728" />
        {/* face */}
        <ellipse cx="60" cy="60" rx="24.5" ry="29" fill="#F4C9A6" />
        {/* ears */}
        <circle cx="36" cy="62" r="5" fill="#F4C9A6" />
        <circle cx="84" cy="62" r="5" fill="#F4C9A6" />
        {/* fringe / front hair */}
        <path d="M35 58 Q33 30 60 30 Q87 30 85 58 Q83 46 74 44 Q66 42 60 44 Q54 55 47 51 Q41 50 38 56 Z" fill="#5A4433" />
        {/* brows */}
        <path d="M46 54 q5 -2.5 10 0" stroke="#4A3728" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M64 54 q5 -2.5 10 0" stroke="#4A3728" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* eyes */}
        <ellipse cx="51" cy="61" rx="3" ry="4" fill="#2B2B2B" />
        <ellipse cx="69" cy="61" rx="3" ry="4" fill="#2B2B2B" />
        <circle cx="52.2" cy="59.8" r="1" fill="#fff" />
        <circle cx="70.2" cy="59.8" r="1" fill="#fff" />
        {/* nose */}
        <path d="M60 62 q2.5 4 -1 6.5" stroke="#D9A97F" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* blush */}
        <ellipse cx="47" cy="69" rx="4" ry="2.4" fill="#F08A7A" opacity=".35" />
        <ellipse cx="73" cy="69" rx="4" ry="2.4" fill="#F08A7A" opacity=".35" />
        {/* smile */}
        <path d="M53 73 q7 6.5 14 0" stroke="#C65A48" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        {/* headset band */}
        <path d="M34 62 Q34 31 60 31 Q86 31 86 62" stroke="#0D2B52" strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* earpiece + mic */}
        <circle cx="34" cy="63" r="6" fill="#17C3B2" stroke="#0D2B52" strokeWidth="1.5" />
        <path d="M34 69 Q31 86 49 84" stroke="#0D2B52" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="50" cy="84" r="3" fill="#17C3B2" />
      </g>
    </svg>
  );
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy, started]);

  const startChat = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!name.trim() || !isEmail(email)) return;
    const sid = makeId();
    setSessionId(sid);
    setStarted(true);
    setMessages([
      {
        role: "assistant",
        content: `Hi ${name.trim().split(" ")[0]}! I'm Ava, the MedXFlow Front Desk assistant. Ask me anything about how MedXFlow can answer your clinic's calls, book appointments, and check patients in.`,
      },
    ]);
    // Log the visitor (fire-and-forget; never blocks the chat).
    fetch("/.netlify/functions/visitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: sid,
        name: name.trim(),
        email: email.trim(),
        page: window.location.pathname,
        referrer: document.referrer || null,
      }),
    }).catch(() => {});
  };

  const send = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          name: name.trim(),
          email: email.trim(),
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply || "Sorry, I didn't catch that - could you rephrase?" },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `I'm having trouble connecting right now (${err.message}). In the meantime, you can book a demo from the button in the header.`,
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>

      {!open && (
        <button className="cbt-launch" onClick={() => setOpen(true)} aria-label="Open chat">
          <img src="/agent-face.webp" alt="Ava, the MedXFlow Front Desk assistant" className="cbt-launch-photo" />
          <span className="cbt-launch-dot" />
        </button>
      )}

      {open && (
        <div className="cbt-panel" role="dialog" aria-label="MedXFlow chat">
          <div className="cbt-head">
            <div className="cbt-head-id">
              <img src="/agent-face.webp" alt="Ava" className="cbt-avatar cbt-avatar-photo" />
              <div>
                <strong>Ava</strong>
                <small>MedXFlow Front Desk assistant</small>
              </div>
            </div>
            <button className="cbt-x" onClick={() => setOpen(false)} aria-label="Close chat">
              ×
            </button>
          </div>

          {!started ? (
            <form className="cbt-gate" onSubmit={startChat}>
              <p className="cbt-gate-lead">
                Hi there 👋 Before we start, could you tell us who you are?
              </p>
              <label>
                Your name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Murphy"
                  autoFocus
                />
                {touched && !name.trim() && <em>Please enter your name.</em>}
              </label>
              <label>
                Email address
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@clinic.ie"
                />
                {touched && !isEmail(email) && <em>Please enter a valid email.</em>}
              </label>
              <button type="submit" className="cbt-start">
                Start chat →
              </button>
            </form>
          ) : (
            <>
              <div className="cbt-body" ref={scrollRef}>
                {messages.map((m, i) => (
                  <div key={i} className={"cbt-msg cbt-" + m.role}>
                    {m.content}
                  </div>
                ))}
                {busy && (
                  <div className="cbt-msg cbt-assistant cbt-typing">
                    <span></span><span></span><span></span>
                  </div>
                )}
              </div>
              <form className="cbt-input" onSubmit={send}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message…"
                  disabled={busy}
                />
                <button type="submit" disabled={busy || !input.trim()} aria-label="Send">
                  ↑
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}

const CSS = `
.cbt-launch{position:fixed; right:22px; bottom:22px; z-index:9999; width:80px; height:80px; padding:0;
  background:transparent; border:none; cursor:pointer; transition:transform .18s ease; display:block; animation:cbtbob 3s ease-in-out infinite}
.cbt-launch:hover{transform:translateY(-5px) scale(1.06); animation-play-state:paused}
.cbt-launch-photo{width:100%; height:100%; display:block; border-radius:50%; object-fit:cover; box-shadow:0 10px 22px rgba(13,43,82,.34); border:3px solid #fff}
.cbt-launch-dot{position:absolute; right:5px; top:6px; width:15px; height:15px; border-radius:50%; background:#22c55e; border:2.5px solid #fff; box-shadow:0 0 0 0 rgba(34,197,94,.5); animation:cbtpulse 2.4s ease-out infinite}
@keyframes cbtpulse{0%{box-shadow:0 0 0 0 rgba(34,197,94,.5)}70%,100%{box-shadow:0 0 0 8px rgba(34,197,94,0)}}
@keyframes cbtbob{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
@media(prefers-reduced-motion:reduce){.cbt-launch{animation:none}}

.cbt-panel{position:fixed; right:24px; bottom:24px; z-index:9999; width:min(380px,calc(100vw - 32px)); height:min(560px,calc(100vh - 48px));
  background:#fff; border-radius:20px; box-shadow:0 30px 80px rgba(13,43,82,.32); display:flex; flex-direction:column; overflow:hidden;
  font-family:'Figtree',system-ui,sans-serif; animation:cbtin .22s ease}
@keyframes cbtin{from{opacity:0; transform:translateY(16px)}to{opacity:1; transform:none}}

.cbt-head{display:flex; align-items:center; justify-content:space-between; padding:14px 16px;
  background:linear-gradient(135deg,#123F7E,#1A5DAD); color:#fff}
.cbt-head-id{display:flex; align-items:center; gap:11px}
.cbt-avatar{width:38px; height:38px; border-radius:50%; background:#17C3B2; color:#0D2B52; display:grid; place-items:center; font-weight:800; font-size:17px}
.cbt-avatar-photo{background:none; padding:0; object-fit:cover; border:2px solid rgba(255,255,255,.6)}
.cbt-head-id strong{display:block; font-size:15px; line-height:1.2}
.cbt-head-id small{font-size:12px; opacity:.8}
.cbt-x{background:transparent; border:none; color:#fff; font-size:26px; line-height:1; cursor:pointer; opacity:.85}
.cbt-x:hover{opacity:1}

.cbt-gate{padding:22px 18px; display:flex; flex-direction:column; gap:16px; flex:1}
.cbt-gate-lead{font-size:15px; color:#0D2B52; line-height:1.5; margin:0}
.cbt-gate label{display:flex; flex-direction:column; gap:6px; font-size:13px; font-weight:600; color:#0D2B52}
.cbt-gate input{padding:11px 13px; border:1px solid rgba(13,43,82,.16); border-radius:10px; font-size:14px; font-family:inherit; outline:none}
.cbt-gate input:focus{border-color:#1A5DAD; box-shadow:0 0 0 3px rgba(26,93,173,.12)}
.cbt-gate em{color:#C0392B; font-size:12px; font-weight:500; font-style:normal}
.cbt-start{margin-top:auto; background:#1A5DAD; color:#fff; border:none; border-radius:999px; padding:13px; font-size:15px; font-weight:700; font-family:inherit; cursor:pointer}
.cbt-start:hover{background:#123F7E}

.cbt-body{flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:10px; background:#F2F6FB}
.cbt-msg{max-width:85%; padding:10px 14px; border-radius:14px; font-size:14px; line-height:1.5; white-space:pre-wrap; word-wrap:break-word}
.cbt-assistant{align-self:flex-start; background:#fff; color:#0D2B52; border:1px solid rgba(13,43,82,.08); border-bottom-left-radius:4px}
.cbt-user{align-self:flex-end; background:#1A5DAD; color:#fff; border-bottom-right-radius:4px}
.cbt-typing{display:flex; gap:5px; align-items:center}
.cbt-typing span{width:7px; height:7px; border-radius:50%; background:#9DAFC4; animation:cbtb 1s infinite}
.cbt-typing span:nth-child(2){animation-delay:.15s}
.cbt-typing span:nth-child(3){animation-delay:.3s}
@keyframes cbtb{0%,60%,100%{opacity:.3; transform:translateY(0)}30%{opacity:1; transform:translateY(-4px)}}

.cbt-input{display:flex; gap:8px; padding:12px; border-top:1px solid rgba(13,43,82,.08); background:#fff}
.cbt-input input{flex:1; padding:11px 14px; border:1px solid rgba(13,43,82,.16); border-radius:999px; font-size:14px; font-family:inherit; outline:none}
.cbt-input input:focus{border-color:#1A5DAD; box-shadow:0 0 0 3px rgba(26,93,173,.12)}
.cbt-input button{width:42px; height:42px; flex:none; border:none; border-radius:50%; background:#1A5DAD; color:#fff; font-size:19px; cursor:pointer}
.cbt-input button:disabled{opacity:.45; cursor:default}
`;
