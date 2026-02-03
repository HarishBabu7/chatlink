import React from "react";
import { Routes, Route } from "react-router-dom";
import OwnerDashboard from "./pages/OwnerDashboard";
import CreateRoom    from "./pages/CreateRoom";
import FriendLanding from "./pages/FriendLanding";
import FriendChat    from "./pages/FriendChat";
import OwnerChat     from "./pages/OwnerChat";

export default function App() {
  return (
    <Routes>
      {/* Owner side */}
      <Route path="/"                  element={<OwnerDashboard />} />
      <Route path="/chat/create"       element={<CreateRoom />}     />
      <Route path="/owner/:roomId"     element={<OwnerChat />}      />

      {/* Friend side — this is the link you share */}
      <Route path="/chat/:roomId"      element={<FriendLanding />}  />
      <Route path="/friend/:roomId"    element={<FriendChat />}     />
    </Routes>
  );
}
