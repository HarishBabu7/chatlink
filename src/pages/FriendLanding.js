import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function FriendLanding() {
  const { roomId } = useParams();
  const nav        = useNavigate();

  return (
    <div className="page-center">
      <div className="card">
        <div className="card__icon">💬</div>
        <div className="card__title">You got a Chat Link!</div>
        <div className="card__sub">
          Someone wants to chat with you. Tap the button below to open the chat.
        </div>

        <div className="note">
          📍 <strong style={{ color: "var(--text-muted)" }}>Location Notice</strong><br />
          This chat will ask for your location permission once. Your location will be shared with the person who sent you this link.
        </div>

        <button className="btn-primary" onClick={() => nav(`/friend/${roomId}`)}>
          Open Chat
        </button>
      </div>
    </div>
  );
}
