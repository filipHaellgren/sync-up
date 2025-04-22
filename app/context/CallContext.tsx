"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  onSnapshot,
  collection,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";

interface CallContextProps {
  inCall: boolean;
  activeCallId: string | null;
  callerId: string | null;
  setInCall: (val: boolean) => void;
  setActiveCallId: (id: string | null) => void;
  answerCall: () => void;
  declineCall: () => void;
}

const CallContext = createContext<CallContextProps | undefined>(undefined);

export const CallProvider = ({
  currentUserId,
  children,
}: {
  currentUserId: string;
  children: React.ReactNode;
}) => {
  const [inCall, setInCall] = useState(false);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [callerId, setCallerId] = useState<string | null>(null);

  // 🧼 Helper to mark call as ended in Firestore
  const markCallAsEnded = async (callId: string) => {
    const callRef = doc(db, "calls", callId);
    await updateDoc(callRef, {
      status: "ended",
      endedAt: new Date(),
    });
  };

  useEffect(() => {
    const q = query(
      collection(db, "calls"),
      where("calleeId", "==", currentUserId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const callId = change.doc.id;
          const data = change.doc.data();

          // 🧼 Ignore ended or already answered calls
          if (data.status === "ended" || data.answer || activeCallId === callId) return;

          console.log("📞 Incoming call from:", data.callerId);
          setActiveCallId(callId);
          setCallerId(data.callerId);
        }
      });
    });

    return () => unsubscribe();
  }, [currentUserId, activeCallId]);

  const answerCall = () => {
    setInCall(true);
    setCallerId(null);
  };

  const declineCall = () => {
    setInCall(false);
    setCallerId(null);

    if (activeCallId) {
      markCallAsEnded(activeCallId); // ✅ mark the call as ended
    }

    setActiveCallId(null);
  };

  return (
    <CallContext.Provider
      value={{
        inCall,
        activeCallId,
        callerId,
        setInCall,
        setActiveCallId,
        answerCall,
        declineCall,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) throw new Error("CallProvider missing");
  return context;
};