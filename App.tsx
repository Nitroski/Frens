import { useEffect, useState } from "react";

type Config = {
  question: string;
  questionGif: string;
  yesLabel: string;
  noLabel: string;
  noMessages: string[];
  yesText: string;
  yesGif: string;
};


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
  const [cfg] = useState<Config>(DEFAULTS);
  const [noCount, setNoCount] = useState(0);
  const [accepted, setAccepted] = useState(false);

  const msgs = cfg.noMessages.filter((m) => m.trim());
  const noText = noCount === 0 || msgs.length === 0 ? cfg.noLabel : msgs[Math.min(noCount - 1, msgs.length - 1)];
  const yesPx = Math.min(18 + noCount * 14, 400);

  return (
    <main className="page">
      {accepted ? (
        <>
          <Gif src={cfg.yesGif} />
          <h1 className="question">{cfg.yesText}</h1>
        </>
      ) : (
        <>
          <Gif src={cfg.questionGif} />
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
