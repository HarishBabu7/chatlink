import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  collection, addDoc, onSnapshot, orderBy, query,
  doc
} from "firebase/firestore";
import { db } from "../firebase";

export default function OwnerChat() {
  const { roomId }       = useParams();
  const nav              = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [room, setRoom]         = useState(null);   // room doc (has friendLocation)
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // ── 1. Listen to the room document (for location updates) ──
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", roomId), (snap) => {
      if (snap.exists()) setRoom(snap.data());
    });
    return unsub;
  }, [roomId]);

  // ── 2. Listen to messages ──
  useEffect(() => {
    const q = query(
      collection(db, "chats", roomId, "messages"),
      orderBy("time", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [roomId]);

  // ── 3. Auto-scroll ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send ──
  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    inputRef.current?.focus();

    await addDoc(collection(db, "chats", roomId, "messages"), {
      from: "owner",
      text,
      time: (await import("firebase/firestore")).serverTimestamp(),
    });
  };

  // ── Format time ──
  const fmt = (ts) => {
    if (!ts?.toDate) return "";
    const d = ts.toDate();
    return d.getHours().toString().padStart(2,"0") + ":" + d.getMinutes().toString().padStart(2,"0");
  };

  const loc = room?.friendLocation;

  return (
    <div className="shell">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <div className="avatar avatar--owner">ME</div>
          <div>
            <div className="header-name">{room?.friendName || "Friend"}</div>
            <div className="header-sub">{loc ? "📍 Location received" : "⏳ Waiting for friend…"}</div>
          </div>
        </div>
        <button className="btn-header" onClick={() => nav("/")}>← Back</button>
      </div>

      {/* Location Card */}
      <div className={`loc-card ${!loc ? "loc-card--empty" : ""}`}>
        {loc ? (
          <>
            <span className="loc-card__icon">📍</span>
            <div className="loc-card__body">
              <div className="loc-card__title">Friend's Location</div>
              <div className="loc-card__coords">
                {loc.lat.toFixed(5)}, {loc.lng.toFixed(5)}
              </div>
              <div className="loc-card__meta">
                Accuracy: ±{loc.accuracy}m &nbsp;·&nbsp; At {new Date(loc.time).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" })}
              </div>
            </div>
            <a
              href={`https://maps.google.com/?q=${loc.lat},${loc.lng}`}
              target="_blank"
              rel="noreferrer"
              className="loc-card__map-link"
            >
              Map →
            </a>
          </>
        ) : (
          <span className="loc-card__waiting">⏳ Waiting for friend to open the link…</span>
        )}
      </div>

      {/* Messages */}
      <div className="msg-area">
        {messages.length === 0 && <div className="msg-empty">No messages yet. Say hi! 👋</div>}

        {messages.map((m) => {
          const isMe = m.from === "owner";
          return (
            <div key={m.id} className={`msg-row ${isMe ? "msg-row--me" : "msg-row--them"}`}>
              <div className={`bubble ${isMe ? "bubble--me" : "bubble--them"}`}>
                <div className="bubble__text">{m.text}</div>
                <div className="bubble__time">{fmt(m.time)}</div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="input-bar">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message…"
        />
        <button className="btn-send" onClick={send}>↑</button>
      </div>
    </div>
  );
}
