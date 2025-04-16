"use client";

import { useCall } from "../context/CallContext";

export default function CallPopup() {
  const { incomingCall, answerCall, declineCall } = useCall();

  if (!incomingCall) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded shadow-lg z-50">
      <p className="mb-2 font-semibold">
        📞 Incoming call from: {incomingCall.from}
      </p>
      <div className="flex gap-2">
        <button
          onClick={answerCall}
          className="bg-green-500 px-4 py-1 rounded hover:bg-green-600"
        >
          Answer
        </button>
        <button
          onClick={declineCall}
          className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
        >
          Decline
        </button>
      </div>
    </div>
  );
}