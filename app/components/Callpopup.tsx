"use client";

import { useCall } from "../context/CallContext";
import { useRouter } from "next/navigation";

export default function CallPopup() {
  const { activeCallId, callerId, answerCall, declineCall } = useCall();
  const router = useRouter();

  if (!activeCallId || !callerId) return null;

  const handleAnswer = () => {
    answerCall();
    router.push("/dashboard"); // or whatever route renders the <Chat> component
  };

  return (
    <div className="fixed top-4 right-4 bg-gray-800 p-4 rounded shadow-lg z-50">
      <p className="text-white">📞 Incoming call from {callerId}</p>
      <div className="flex gap-2 mt-2">
        <button onClick={handleAnswer} className="bg-green-500 px-4 py-1 rounded text-white">Answer</button>
        <button onClick={declineCall} className="bg-red-500 px-4 py-1 rounded text-white">Decline</button>
      </div>
    </div>
  );
}