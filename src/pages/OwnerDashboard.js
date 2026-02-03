import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../firebase";

export default function OwnerDashboard() {
  const nav = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all rooms this owner created
  // We use localStorage ONLY to store the owner's unique ID (not chat data)
  useEffect(() => {
    let ownerId = localStorage.getItem("chatlink_owner_id");
    if (!ownerId) {
      ownerId = "owner_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
      localStorage.setItem("chatlink_owner_id", ownerId);
    }

    const q = query(
      collection(db, "chats"),
      where("ownerId", "==", ownerId),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setRooms(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return unsub;
  }, []);

  return (
    <div className="shell" style={{ justifyContent: "flex-start" }}>
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <div className="avatar avatar--owner">ME</div>
          <div>
            <div className="header-name">ChatLink</div>
            <div className="header-sub">Your Chats</div>
          </div>
        </div>
        <button className="btn-header" onClick={() => nav("/chat/create")}>
          + New
        </button>
      </div>

      {/* Room List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px" }}>
        {loading && <div className="spinner" style={{ marginTop: 60 }} />}

        {!loading && rooms.length === 0 && (
          <div style={{ textAlign: "center", marginTop: 80 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
            <div style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6 }}>
              No chats yet.<br />
              Tap <strong style={{ color: "var(--text-accent)" }}>+ New</strong> to create a link and share it with a friend.
            </div>
          </div>
        )}

        {!loading &&
          rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => nav(`/owner/${room.id}`)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "13px 14px",
                marginBottom: 8,
                background: "var(--bg-input-bg)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              <div className="avatar avatar--friend" style={{ width: 36, height: 36, fontSize: 11 }}>
                {room.friendName ? room.friendName[0].toUpperCase() : "?"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {room.friendName || "Friend (not opened yet)"}
                </div>
                <div style={{ color: "var(--text-dim)", fontSize: 12, marginTop: 2 }}>
                  {room.friendLocation ? "📍 Location shared" : "⏳ Waiting…"}
                </div>
              </div>
              <div style={{ color: "var(--text-dim)", fontSize: 11 }}>→</div>
            </div>
          ))}
      </div>
    </div>
  );
}
