import React, { useEffect } from "react";
import { useCall } from "../context/CallContext";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { FriendType, ProfileType } from "../styles";

interface Props {
  currentUser: ProfileType | null;
  friends: FriendType[];
}

export default function CallListener({ currentUser, friends }: Props) {
  const { setIsReceivingCall, setCallId, setCallerInfo } = useCall();

  useEffect(() => {
    if (!currentUser) return;

    const incomingCallRef = doc(db, "incomingCalls", currentUser.steamid);

    const unsubscribe = onSnapshot(incomingCallRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const callData = docSnapshot.data();
        setCallId(callData.callId);
        setIsReceivingCall(true);
        setCallerInfo({
          id: callData.callerId,
          name: callData.callerName,
          avatar: callData.callerAvatar,
        });
        console.log("Incoming call!", callData);
      } else {
        setIsReceivingCall(false);
        setCallId(null);
        setCallerInfo(null);
      }
    });

    return () => unsubscribe();
  }, [currentUser, setIsReceivingCall, setCallId, setCallerInfo]);

  return null;
}
