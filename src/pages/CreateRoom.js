import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function CreateRoom() {
  const nav = useNavigate();
  const [name, setName]       = useState("");
  const [link, setLink]       = useState("");   // the generated link
  const [copied, setCopied]   = useState(false);
  const [creating, setCreating] = useState(false);

  const create = async () => {
    if (!name.trim()) return;
    setCreating(true);

    // Generate a unique roomId
    const roomId = "room_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

    // Get or create owner ID
    let ownerId = localStorage.getItem("chatlink_owner_id");
    if (!ownerId) {
      ownerId = "owner_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
      localStorage.setItem("chatlink_owner_id", ownerId);
    }

    // Write the room document to Firestore
    await setDoc(doc(db, "chats", roomId), {
      ownerId:        ownerId,
      friendName:     name.trim(),
      friendLocation: null,   // will be filled when friend opens the link
      createdAt:      serverTimestamp(),
    });

    // Build the shareable URL
    const shareUrl = `${window.location.origin}/chat/${roomId}`;
    setLink(shareUrl);
    setCreating(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="page-center">
      <div className="card">
        <div className="card__icon">🔗</div>
        <div className="card__title">Create a Chat Link</div>
        <div className="card__sub">
          Enter your friend's name, then share the generated link with them.
        </div>

        {/* Name Input */}
        <input
          style={{
            width: "100%",
            padding: "13px 18px",
            borderRadius: 14,
            border: "1px solid var(--border-soft)",
            background: "var(--bg-input-bg)",
            color: "#fff",
            fontSize: 15,
            outline: "none",
            marginBottom: 16,
          }}
          placeholder="Friend's name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !link && create()}
          disabled={!!link}
        />

        {/* Create Button (hidden once link is generated) */}
        {!link && (
          <button className="btn-primary" onClick={create} disabled={creating || !name.trim()}>
            {creating ? "Creating…" : "Create Link"}
          </button>
        )}

        {/* Generated Link + Copy Button */}
        {link && (
          <>
            <div
              style={{
                background: "#16162a",
                border: "1px solid var(--border-soft)",
                borderRadius: 12,
                padding: "12px 14px",
                marginBottom: 14,
                wordBreak: "break-all",
                fontSize: 13,
                color: "var(--text-muted)",
                textAlign: "left",
              }}
            >
              <div style={{ color: "var(--text-accent)", fontSize: 11, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Your Link
              </div>
              {link}
            </div>

            <button className="btn-primary" onClick={copyLink}>
              {copied ? "✓ Copied!" : "📋 Copy Link"}
            </button>

            <button className="btn-primary" style={{ marginTop: 10, background: "linear-gradient(135deg, var(--accent-teal), #06b6d4)" }} onClick={() => nav(`/owner/${link.split("/chat/")[1]}`)}>
              Open Chat →
            </button>
          </>
        )}

        {/* Back */}
        <button className="btn-secondary" onClick={() => nav("/")}>← Back</button>
      </div>

      {/* Toast */}
      {copied && <div className="toast">✓ Link copied to clipboard!</div>}
    </div>
  );
}
