import { createContext, useContext, useState, ReactNode, useRef } from "react";
import { startCall, answerCall as answerWebRTCCall } from "../../lib/webrtc";

interface CallContextProps {
  incomingCall: any;
  setIncomingCall: (call: any) => void;
  inCall: boolean;
  setInCall: (inCall: boolean) => void;
  activeCallId: string | null;
  setActiveCallId: (id: string | null) => void;
  answerCall: () => Promise<void>;
  declineCall: () => void;
  initiateCall: (calleeId: string) => Promise<void>;
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
}

// This was missing - create the context first
const CallContext = createContext<CallContextProps | undefined>(undefined);

export function CallProvider({ children }: { children: ReactNode }) {
  const [incomingCall, setIncomingCall] = useState<any>(null);
  const [inCall, setInCall] = useState(false);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Function to start a call
  const initiateCall = async (calleeId: string) => {
    const userId = "YOUR_USER_ID"; // Replace with actual user ID from auth or profile
    const result = await startCall(userId, calleeId);
    
    if (result) {
      const { callId, localStream } = result;
      
      setActiveCallId(callId);
      setInCall(true);
      setLocalStream(localStream);
      
      // Set local stream to video element
      if (localVideoRef.current && localStream) {
        localVideoRef.current.srcObject = localStream;
      }
    }
  };

  // Function to answer an incoming call
  const answerCall = async () => {
    if (!incomingCall) return;
    
    console.log("✅ Call answered");
    const result = await answerWebRTCCall(incomingCall.callId);
    
    if (result) {
      const { localStream, remoteStream } = result;
      
      setInCall(true);
      setLocalStream(localStream);
      setRemoteStream(remoteStream);
      
      // Set streams to video elements
      if (localVideoRef.current && localStream) {
        localVideoRef.current.srcObject = localStream;
      }
      
      if (remoteVideoRef.current && remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    }
  };

  const declineCall = () => {
    console.log("❌ Call declined");
    setIncomingCall(null);
    setActiveCallId(null);
  };

  return (
    <CallContext.Provider
      value={{
        incomingCall,
        setIncomingCall,
        inCall,
        setInCall,
        activeCallId,
        setActiveCallId,
        answerCall,
        declineCall,
        initiateCall,
        localVideoRef,
        remoteVideoRef
      }}
    >
      {children}
    </CallContext.Provider>
  );
}

// Add the useCall hook
export function useCall() {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCall must be used within a CallProvider");
  }
  return context;
}