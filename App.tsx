import { useEffect, useMemo, useState } from "react";

type Config = {
  question: string;
  questionGif: string;
  yesLabel: string;
  noLabel: string;
  noMessages: string[];
  yesText: string;
  yesGif: string;
};

// Default text. Paste gif links in the Edit panel, or put them here.
const DEFAULTS: Config = {
  question: "Can We Both be Friends 👉👈?",
  questionGif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGdmemdzdWZxNDI1ODdoc3JuanNibHE3ZGwxeTQyMmJmemRnNDRtNCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/11nPtD8gHrkMr6/giphy.gif",
  yesLabel: "Yesss 😊",
  noLabel: "No",
  noMessages: [
    "Are you sure? 🥺",
    "Really sure? 😢",
    "Please, I beg you 🥹",
    "I'm gonna start crying now 😭",
    "Okieee np😭😭😭😭",
  ],
  yesText: "Yesssssss 🫂 !!!!!!",
  yesGif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZm1manRqYTE2amdzc294OThqNm9ubm00eHg2Nm9vbWMxbWttcml4ZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Cb0N0cFiCqqggGaLhX/giphy.gif",
};

const STORE_KEY = "friends-page-config";

const encode = (c: Config) =>
  btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(c))));
const decode = (s: string): Partial<Config> =>
  JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(s), (ch) => ch.charCodeAt(0))));

function fromHash(): Config | null {
  const m = window.location.hash.match(/^#c=(.+)$/);
  if (!m) return null;
  try {
    return { ...DEFAULTS, ...decode(m[1]) };
  } catch {
    return null;
  }
}

function fromStorage(): Config | null {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : null;
  } catch {
    return null;
  }
}

// only allow normal links / relative paths for images
const safeSrc = (u: string) => (/^(https?:\/\/|\.{0,2}\/)/i.test(u.trim()) ? u.trim() : "");

function Gif({ src, hint }: { src: string; hint?: string }) {
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [src]);
  const url = safeSrc(src);
  if (url && !broken) {
    return <img className="gif" src={url} alt="" referrerPolicy="no-referrer" onError={() => setBroken(true)} />;
  }
  return hint ? <div className="gif placeholder">{broken ? "⚠️ couldn't load that gif link" : hint}</div> : null;
}

export default function App() {
  const shared = useMemo(fromHash, []);
  const viewer = shared !== null; // opened from a share link → hide the editor
  const [cfg, setCfg] = useState<Config>(() => shared ?? fromStorage() ?? DEFAULTS);
  const [editing, setEditing] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (viewer) return;


  const set = <K extends keyof Config>(k: K, v: Config[K]) => setCfg((c) => ({ ...c, [k]: v }));

  const msgs = cfg.noMessages.filter((m) => m.trim());
  const noText = noCount === 0 || msgs.length === 0 ? cfg.noLabel : msgs[Math.min(noCount - 1, msgs.length - 1)];
  const yesPx = Math.min(18 + noCount * 14, 400);

  const copyLink = async () => {
    const url = `${location.origin}${location.pathname}#c=${encode(cfg)}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("Share link copied! 🔗");
    } catch {
      window.prompt("Copy this link:", url);
    }
  };

  return (
    <main className="page">
      {!viewer && (
        <button className="edit-btn" onClick={() => setEditing((e) => !e)}>
          {editing ? "✕ Close" : "✎ Edit"}
        </button>
      )}

      {accepted ? (
        <>
          <Gif src={cfg.yesGif} hint="🖼️ add the “Yes” gif link in ✎ Edit" />
          <h1 className="question">{cfg.yesText}</h1>
        </>
      ) : (
        <>
          <Gif src={cfg.questionGif} hint="🖼️ add a gif link in ✎ Edit" />
          <h1 className="question">{cfg.question}</h1>
          <div className="buttons">
            <button className="btn yes" style={{ fontSize: `min(${yesPx}px, 18vw)` }} onClick={() => setAccepted(true)}>
              {cfg.yesLabel}
            </button>
            <button className="btn no" onClick={() => setNoCount((n) => n + 1)}>
              {noText}
            </button>
          </div>
        </>
      )}

    </main>
  );
}
