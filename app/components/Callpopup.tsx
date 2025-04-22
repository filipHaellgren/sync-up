"use client";

import { useCall } from "../context/CallContext";
import { endCall } from "../../lib/webrtc";

export default function CallPopup() {
  const { 
    incomingCall, 
    inCall,
    activeCallId, 
    answerCall, 
    declineCall,
    setInCall,
    setActiveCallId,
    localVideoRef,
    remoteVideoRef
  } = useCall();

  const handleEndCall = async () => {
    if (activeCallId) {
      await endCall(activeCallId);
      setInCall(false);
      setActiveCallId(null);
    }
  };

  // Show incoming call notification
  if (incomingCall && !inCall) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded shadow-lg z-50">
        <p className="mb-2 font-semibold">
          📞 Incoming call from: {incomingCall.from}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => answerCall()}
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

  // Show active call interface
  if (inCall) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="relative w-full max-w-4xl">
          {/* Remote video (large) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg"
          />
          
          {/* Local video (small overlay) */}
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute bottom-4 right-4 w-1/4 rounded-lg border-2 border-white"
          />
          
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <button 
              onClick={handleEndCall}
              className="bg-red-500 p-3 rounded-full hover:bg-red-600"
            >
              <span className="text-xl">📞</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
