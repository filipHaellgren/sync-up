// VideoCall.tsx
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { answerCall } from "@/lib/webrtc";

export default function VideoCall({ currentUserId, friendId }: { currentUserId: string, friendId: string }) {
  const [incomingCallId, setIncomingCallId] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "calls", `${currentUserId}`), (snapshot) => {
      const data = snapshot.data();
      if (data?.calleeId === currentUserId && data.offer && !data.answer) {
        setIncomingCallId(snapshot.id);
        setShowPrompt(true);
      }
    });

    return () => unsubscribe();
  }, [currentUserId]);

  const handleAccept = async () => {
    if (incomingCallId) {
      await answerCall(incomingCallId);
      setShowPrompt(false);
    }
  };

  const handleReject = () => {
    setIncomingCallId(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="absolute bottom-4 right-4 bg-[#1E1F22] p-4 rounded shadow-md">
      <p className="mb-2 text-white">Incoming call...</p>
      <div className="flex gap-2">
        <button onClick={handleAccept} className="bg-green-500 px-3 py-1 rounded text-white">
          Accept
        </button>
        <button onClick={handleReject} className="bg-red-500 px-3 py-1 rounded text-white">
          Decline
        </button>
      </div>
    </div>
  );
}