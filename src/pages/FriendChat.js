import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  collection, addDoc, onSnapshot, orderBy, query,
  doc, updateDoc, serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";

export default function FriendChat() {
  const { roomId }       = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [locStatus, setLocStatus] = useState("requesting"); // requesting | granted | denied
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // ── 1. Request & save location on mount ──
  useEffect(() => {
    if (!navigator.geolocation) { setLocStatus("denied"); return; }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        // Write location into the room document
        await updateDoc(doc(db, "chats", roomId), {
          friendLocation: {
            lat:      pos.coords.latitude,
            lng:      pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            time:     Date.now(),
          },
        });
        setLocStatus("granted");
      },
      () => setLocStatus("denied"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [roomId]);

  // ── 2. Listen to messages in real time ──
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

  // ── 3. Auto-scroll to bottom ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send a message ──
  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    inputRef.current?.focus();

    await addDoc(collection(db, "chats", roomId, "messages"), {
      from: "friend",
      text,
      time: serverTimestamp(),
    });
  };

  // ── Format time ──
  const fmt = (ts) => {
    if (!ts?.toDate) return "";
    const d = ts.toDate();
    return d.getHours().toString().padStart(2,"0") + ":" + d.getMinutes().toString().padStart(2,"0");
  };

  return (
    <div className="shell">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <div className="avatar avatar--friend">FR</div>
          <div>
            <div className="header-name">Chat</div>
            <div className="header-sub">
              {locStatus === "requesting" && "📍 Requesting location…"}
              {locStatus === "granted"    && "📍 Location shared ✓"}
              {locStatus === "denied"     && "📍 Location denied"}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="msg-area">
        {messages.length === 0 && <div className="msg-empty">No messages yet. Say hi! 👋</div>}

        {messages.map((m) => {
          const isMe = m.from === "friend";
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
