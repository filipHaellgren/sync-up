import React, { createContext, useContext } from 'react';
import { FriendType, ProfileType } from '../styles';
import { startCall, answerCall } from '@/lib/webrtc';

import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';


interface CallContextType {
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    peerConnection: RTCPeerConnection | null;
    callId: string | null;
    isCalling: boolean;
    isReceivingCall: boolean;
    error: string | null;
    getLocalStream: () => Promise<void>;
    startVideoCall: (friend: FriendType, user:ProfileType) => Promise<void>;
    answerVideoCall: (callId: string) => Promise<void>;
    hangUp: () => void;
    setRemoteStream: (stream: MediaStream | null) => void;
    setIsReceivingCall: (isReceiving: boolean) => void;
    setCallId: (callId: string | null) => void;
  }


const CallContext = createContext<CallContextType | undefined>(undefined);

export const useCall = () => {
    const context = useContext(CallContext);
    if (!context) {
        throw new Error("useCall must be used within a CallProvider");
    }
    return context;
}

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [localStream, setLocalStream] = React.useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = React.useState<MediaStream | null>(null);
    const [peerConnection, setPeerConnection] = React.useState<RTCPeerConnection | null>(null);
    const [callId, setCallId] = React.useState<string | null>(null);
    const [isCalling, setIsCalling] = React.useState<boolean>(false);
    const [isReceivingCall, setIsReceivingCall] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);


    const getLocalStream = async () => {
        try {
            console.log("Requesting local stream...");
            const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:true});
            setLocalStream(stream);
            setError(null);
            console.log("Local stream obtained successfully.");
        }
        catch (err) {
            console.error("Error accessing media devices.", err);
            setError("Error accessing media devices.");
        }
    }

    const startVideoCall = async ( friend: FriendType, user:ProfileType) => {
        getLocalStream();
        if (!localStream) return;
        try {
        const handleRemoteStream = (stream: MediaStream) => {
            console.log("Remote stream arrived in CallContext!", stream);
            setRemoteStream(stream);
          };
            const pc = await startCall(localStream, friend.steamid, handleRemoteStream);
            setPeerConnection(pc);
            setCallId(friend.steamid);
            setIsCalling(true);
            setError(null);
            console.log("Video call started successfully.");

            const incomingCallRef = doc(db, 'incomingCalls', friend.steamid, ); 
      await setDoc(incomingCallRef, {
        callerId: user.steamid, 
        callerName: user.personaname,
        callerAvatar: user.avatarfull,
        calleeId: friend.steamid,
       
      });

        } catch (err) {
            console.error("Error starting video call.", err);
            setError("Error starting video call.");
        }
    }

    const answerVideoCall = async (callId: string) => {
        if (!localStream) return;
        try {
            const pc = await answerCall(localStream, callId, (stream: MediaStream) => {
                setRemoteStream(stream);
            });
            setPeerConnection(pc);
            setCallId(callId);
            setIsReceivingCall(true);
            setError(null);
            console.log("Video call answered successfully.");
        }
        catch (err) {
            console.error("Error answering video call.", err);
            setError("Error answering video call.");
        }
    }
    const hangUp = () => {
        if (peerConnection) {   
            peerConnection.close();
            setPeerConnection(null);
            setRemoteStream(null);
            setCallId(null);
            setIsCalling(false);
            setIsReceivingCall(false);
            console.log("Video call ended.");
        }
    }





    const value: CallContextType = {
        localStream,
        remoteStream,
        peerConnection,
        callId,
        isCalling,
        isReceivingCall,
        error,
        getLocalStream,
        startVideoCall,
        answerVideoCall,
        hangUp,
        setRemoteStream,
        setIsReceivingCall,
        setCallId,
      };
    return (
        <CallContext.Provider value={value}>
            {children}
        </CallContext.Provider>
    );
}