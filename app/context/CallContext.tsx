// context/CallContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface CallContextProps {
  incomingCall: any;
  setIncomingCall: (call: any) => void;
  inCall: boolean;
  setInCall: (inCall: boolean) => void;
  activeCallId: string | null;
  setActiveCallId: (id: string | null) => void;
  answerCall: () => void;
  declineCall: () => void;
}

const CallContext = createContext<CallContextProps | undefined>(undefined);

export function CallProvider({ children }: { children: ReactNode }) {
  const [incomingCall, setIncomingCall] = useState<any>(null);
  const [inCall, setInCall] = useState(false);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);

  const answerCall = () => {
    console.log("✅ Call answered");
    setInCall(true);
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
      }}
    >
      {children}
    </CallContext.Provider>
  );
}

export function useCall() {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCall must be used within a CallProvider");
  }
  return context;
}